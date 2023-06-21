import {
  ISerializedRange,
  IHighlight,
  ActionResponse,
  MessageAction,
  MessageData,
} from './types';
import { injectSidebar } from './utils/InjectScript';
import {
  getSelectionInfo,
  highlightText,
  removeHighlight,
  serializeRange,
} from './utils/Highlighting';
import NDK, { NDKNip07Signer, NDKEvent } from '@nostr-dev-kit/ndk';
import { getRelays } from './utils/Relay';

// Enable Nip07 Nostr Provider
import './nostrprovider';

const KIND_HIGHLIGHT = 9802;

// TODO: Fetch relay urls from extension config
const relayUrls = getRelays();
const ndk = new NDK({
  explicitRelayUrls: relayUrls,
  signer: new NDKNip07Signer(),
});

/**
 * Sends a message to background script to confirm if loaded tabs have content script
 */
chrome.runtime.sendMessage({ action: 'content_script_loaded' });

let highlights: IHighlight[] = [];

/**
 * Listen for highlight mesages and take actions that render highlights on the page
 */
chrome.runtime.onMessage.addListener(
  async (
    request: MessageData<any>,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (res: ActionResponse) => void
  ) => {
    let outcome: ActionResponse = {
      success: false,
    };

    switch (request.action) {
      case MessageAction.LOAD_HIGHLIGHTS:
        await ndk.connect(); // TODO: improve relay connections management

        const pageUrl = request.data;

        const highlightFilter = {
          kinds: [KIND_HIGHLIGHT],
          tags: [['r', pageUrl]],
        };

        // TODO: Subscibe to highlight events
        highlights = [...(await ndk.fetchEvents(highlightFilter))]
          .filter((event: NDKEvent) => {
            const eventHasContent = event.content && event.content.length > 0;
            const eventLinksUrl =
              event.tags.find((tag) => tag[0] === 'r')?.[1] === pageUrl;
            return eventHasContent && eventLinksUrl;
          })
          .map(eventToHighlight);
        break;

      case MessageAction.GET_HIGHLIGHTS:
        console.log(highlights);

        outcome = {
          success: true,
          data: highlights,
        } as ActionResponse;
        break;

      case MessageAction.CREATE_HIGHLIGHT:
        try {
          const { selection, range, text } = await getSelectionInfo();
          await highlightText(selection, range, text);

          const rangeStr = serializeRange(range);
          await ndk.connect(); // TODO: improve relay connections management

          return tryPublishHighlight(rangeStr, text, ndk);
        } catch (e) {
          outcome = {
            success: false,
            error: e,
          } as ActionResponse;
        }
        break;

      case MessageAction.REMOVE_HIGHLIGHTS:
        await removeHighlight()
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
chrome.storage.local.get('shortcut', ({ shortcut = 'Ctrl+H' }) => {
  console.log({ shortcut });
  document.addEventListener('keydown', (event) => {
    const keys = shortcut.split('+');

    let ctrlPressed = keys.includes('Ctrl') ? event.ctrlKey : true;
    let altPressed = keys.includes('Alt') ? event.altKey : true;
    let shiftPressed = keys.includes('Shift') ? event.shiftKey : true;
    let keyIsCorrect = keys.includes(event.key.toUpperCase());

    if (ctrlPressed && altPressed && shiftPressed && keyIsCorrect) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab.id) {
          console.log('shortcut', keyIsCorrect);
          chrome.tabs.sendMessage(activeTab.id, {
            action: MessageAction.CREATE_HIGHLIGHT,
          });
          return;
        }
      });
    }
  });
});

// const renderHighlightsOnCanvas = async (highlights: Highlight[]) => {
//   const selection = document.getSelection();

//   if (!selection) {
//     return;
//   }

//   highlights.forEach(async ({ range: rangeStr, text }) => {
//     try {
//       const range = hackyDeserializeRange(rangeStr, text);
//       selection.addRange(range);
//       await highlightText(selection, range, text);
//       selection.removeRange(range);
//     } catch (e) {
//       console.error(e);
//     }
//   });
// };

const tryPublishHighlight = async (
  range: ISerializedRange,
  text: string,
  ndk: NDK
): Promise<ActionResponse> => {
  try {
    const event = new NDKEvent(ndk);
    event.content = text;
    event.kind = KIND_HIGHLIGHT;
    event.tags = [
      ['r', window.location.href],
      ['range', JSON.stringify(range)],
    ];

    // TODO: Publish event to Nostr
    // await event.publish();

    // TODO: Should we wait for the event to come from nostr subscription?
    highlights.push(eventToHighlight(event));

    return { success: true };
  } catch (e) {
    return { success: false, error: e } as ActionResponse;
  }
};

const eventToHighlight = (event: NDKEvent): IHighlight => {
  const range = event.tags.find((tag) => tag[0] === 'range')?.[1];

  return {
    text: event.content,
    author: event.pubkey,
    id: event.id,
    range,
  };
};
