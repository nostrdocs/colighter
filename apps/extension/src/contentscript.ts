import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk';
import {
  ActionResponse,
  IHighlight,
  MessageAction,
  MessageData,
} from './types';
import { injectSidebar } from './utils/InjectScript';
import {
  getHighlighter,
  highlightCurrentSelection,
  removeCurrentSelectionHighlight,
} from './utils/Highlighting';
import { Settings } from './utils/Storage';

// Enable Nip07 Nostr Provider
import './nostrprovider';

const KIND_HIGHLIGHT = 9802;
const HIGHLIGHT_STORAGE_KEY = 'colighter';

const settings = new Settings();
let ndk: NDK | null = null;

const initializeNDK = async () => {
  const newNdk = new NDK({
    explicitRelayUrls: await settings.getRelays(),
    signer: new NDKNip07Signer(),
  });

  await newNdk.connect();
  return newNdk;
};

let colighter: NDKEvent & { debug: number } = JSON.parse(
  localStorage.getItem(HIGHLIGHT_STORAGE_KEY) || '{}'
);
if (!colighter.debug && process.env.NODE_ENV === 'development') {
  colighter.debug = 1;
} else if (process.env.NODE_ENV === 'production') {
  colighter.debug = 0;
}
localStorage.setItem(HIGHLIGHT_STORAGE_KEY, JSON.stringify(colighter));

/**
 * Sends a message to background script to confirm if loaded tabs have content script
 */
chrome.runtime.sendMessage({ action: 'content_script_loaded' });

let highlights: IHighlight[] = [];
let highlighter: Highlighter | null = null;

/**
 * Listen for highlight mesages and take actions that render highlights on the page
 */
chrome.runtime.onMessage.addListener(
  async (
    request: MessageData<any>,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (res: ActionResponse) => void
  ) => {
    if (!highlighter) {
      highlighter = getHighlighter();
    }

    let outcome: ActionResponse = {
      success: false,
    };

    try {
      if (!ndk) {
        ndk = await initializeNDK();
      }
    } catch (e) {
      return (outcome = {
        success: false,
        error: 'Failed to initialize NDK',
      } as ActionResponse);
    }

    console.log('request', request);

    switch (request.action) {
      case MessageAction.LOAD_HIGHLIGHTS:
        const pageUrl = request.data;

        if (!ndk) {
          return (outcome = {
            success: false,
            error: 'No NDK instance',
          } as ActionResponse);
        }
        const highlightFilter = {
          kinds: [KIND_HIGHLIGHT],
          tags: [['r', pageUrl]],
        };
        let highlightsToLoad: NDKEvent[] = [
          ...(await ndk.fetchEvents(highlightFilter)),
        ];

        if (colighter.debug === 1) {
          const localHighlights = JSON.parse(
            localStorage.getItem(HIGHLIGHT_STORAGE_KEY) || '[]'
          );
          const localHighlightSet = new Set([localHighlights]);
          highlightsToLoad = [...highlightsToLoad, ...localHighlightSet];
        }
        highlights = highlightsToLoad
          .filter((event: NDKEvent) => {
            if (!event.tags) return false;
            const eventHasContent = event.content && event.content.length > 0;
            const eventLinksUrl =
              event.tags.find(
                (tag) => tag[0] === 'r' || tag[0] === 'range'
              )?.[1] === pageUrl;
            return eventHasContent && eventLinksUrl;
          })
          .map(eventToHighlight);
        break;

      case MessageAction.GET_HIGHLIGHTS:
        highlights = highlights.filter(
          (highlight) => highlight.text.length > 0
        );
        outcome = {
          success: true,
          data: highlights,
        } as ActionResponse;
        break;

      case MessageAction.CREATE_HIGHLIGHT:
        try {
          if (!ndk) {
            return (outcome = {
              success: false,
              error: 'No NDK instance',
            } as ActionResponse);
          }
          const { serializedRange, selectedText } =
            await highlightCurrentSelection(highlighter);

          if (!serializedRange || !selectedText) {
            throw new Error('No selection');
          }

          return tryPublishHighlight(serializedRange, selectedText, ndk);
        } catch (e) {
          outcome = {
            success: false,
            error: e,
          } as ActionResponse;
        }
        break;

      case MessageAction.REMOVE_HIGHLIGHTS:
        await removeCurrentSelectionHighlight(highlighter)
          .then((res) => {
            return res;
          })
          .catch((e) => {
            return (outcome = {
              success: false,
              error: e,
            } as ActionResponse);
          });
        break;

      case MessageAction.OPEN_SIDEBAR:
        injectSidebar();
        return (outcome = {
          success: true,
        } as ActionResponse);

      case MessageAction.CLOSE_SIDEBAR:
        const sidebarIframe = document.getElementById('colighter-sidebar');
        sidebarIframe?.parentNode?.removeChild(sidebarIframe);
        return (outcome = {
          success: true,
        } as ActionResponse);

      default:
        outcome = {
          success: false,
          error: 'Unknown message action',
        } as ActionResponse;
        break;
    }

    sendResponse(outcome);
  }
);

// TODO: Fetch shortcut from extension config
// TODO: sync shortcut message with background script
// chrome.storage.local.get('shortcut', ({ shortcut = 'Ctrl+H' }) => {
//   document.addEventListener('keydown', (event) => {
//     const keys = shortcut.split('+');

//     let ctrlPressed = keys.includes('Ctrl') ? event.ctrlKey : true;
//     let altPressed = keys.includes('Alt') ? event.altKey : true;
//     let shiftPressed = keys.includes('Shift') ? event.shiftKey : true;
//     let keyIsCorrect = keys.includes(event.key.toUpperCase());

//     if (ctrlPressed && altPressed && shiftPressed && keyIsCorrect) {
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         const activeTab = tabs[0];
//         if (activeTab.id) {
//           console.log('shortcut', keyIsCorrect);
//           chrome.tabs.sendMessage(activeTab.id, {
//             action: MessageAction.CREATE_HIGHLIGHT,
//           });
//           return;
//         }
//       });
//     }
//   });
// });

const tryPublishHighlight = async (
  range: string,
  text: string,
  ndk: NDK
): Promise<ActionResponse> => {
  try {
    const event = new NDKEvent(ndk);
    event.content = text;
    event.kind = KIND_HIGHLIGHT;
    event.created_at = Math.floor(Date.now() / 1000);
    event.tags = [
      ['r', window.location.href],
      ['range', range, 'colighter'],
    ];
    console.log(event,"event")
    if (colighter.debug === 1) {
      localStorage.setItem(HIGHLIGHT_STORAGE_KEY, JSON.stringify({event}));
    } else {
      await event.publish();
    }

    // TODO: Should we wait for the event to come from nostr subscription?
    highlights.push(eventToHighlight(event));

    return { success: true };
  } catch (e) {
    return { success: false, error: e } as ActionResponse;
  }
};

const eventToHighlight = (event: NDKEvent): IHighlight => {
  const range = event.tags.find((tag) => tag[0] === 'range')?.[1];

  if (range) {
    try {
      // Render highlight on page
      highlighter?.deserialize(range);
    } catch (e) {
      console.error('Failed to deserialize highlight range', e);
    }
  }

  return {
    text: event.content,
    author: event.pubkey,
    id: event.id,
    created_at: event.created_at,
    range,
  };
};
