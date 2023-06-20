import { sha256Hash, ISerializedRange, IHighlight } from 'colighter';
import { ActionResponse, MessageAction, MessageData } from './types';
import { tryReadLocalStorage, tryWriteLocalStorage } from './utils/Storage';
import { injectSidebar } from './utils/InjectScript';
import {
  getSelectionInfo,
  highlightText,
  removeHighlight,
  serializeRange,
} from './utils/Highlighting';
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';

const KIND_HIGHLIGHT = 9802;

// TODO: Fetch relay urls from extension config
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.nostrdocs.com',
    'wss://relay.f7z.io',
    'wss://nos.lol',
  ],
});

/**
 * Sends a message to background script to confirm if loaded tabs have content script
 */
chrome.runtime.sendMessage({ action: 'content_script_loaded' });

let storageKey = '';

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
        await ndk.connect();

        const pageUrl = request.data;

        const highlightFilter = { kinds: [KIND_HIGHLIGHT] }; // tags: [["r", pageUrl]]

        const highlights: IHighlight[] = [
          ...(await ndk.fetchEvents(highlightFilter)),
        ].map((event: NDKEvent) => {
          return {
            text: event.content,
            author: event.pubkey,
            range: { startPath: [], endPath: [], startOffset: 0, endOffset: 0 },
            hashId: event.id,
          };
        });

        storageKey = await sha256Hash(pageUrl);
        await tryWriteLocalStorage<string>(
          storageKey,
          JSON.stringify(highlights)
        );

        // Request render highlights on canvas
        // await renderHighlightsOnCanvas(highlights);

        break;

      case MessageAction.GET_HIGHLIGHTS:
        let knownHighlights = await tryReadLocalStorage<string>(storageKey);

        try {
          if (!knownHighlights) {
            throw 'No known highlights';
          }

          const highlights = JSON.parse(knownHighlights) as IHighlight[];
          console.log(highlights);
          // await renderHighlightsOnCanvas(highlights);
          outcome = {
            success: true,
            data: highlights,
          } as ActionResponse;
        } catch (e) {
          outcome = {
            success: false,
            error: e,
          } as ActionResponse;
        }

        break;

      case MessageAction.CREATE_HIGHLIGHT:
        try {
          const { selection, range, text } = await getSelectionInfo();
          await highlightText(selection, range, text);

          const rangeStr = serializeRange(range);
          return trySaveHighlight(rangeStr, text);
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

const trySaveHighlight = async (
  range: ISerializedRange,
  text: string
): Promise<ActionResponse> => {
  throw 'Not implemented';
  // try {
  //   const highlight = await Highlight.create(text, range, '0x000000');
  //   await collab.addHighlight(highlight);
  //   return { success: true };
  // } catch (e) {
  //   return { success: false, error: e } as ActionResponse;
  // }
};
storageKey;
