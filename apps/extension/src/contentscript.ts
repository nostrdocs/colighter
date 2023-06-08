import {
  Highlight,
  HighlightCollectionUpdate,
  IHighlightCollection,
  IHighlightCollectionAppModel,
  HighlightContainerRuntimeFactory,
  sha256Hash,
  ISerializedRange,
} from 'colighter';
import { CollabRelayClient, loadCollabModel } from 'nostrcollab';
import {
  browserSourceNostrId,
  createEphemeralNostrId,
  fetchNostrUserMetadata,
} from 'nostrfn';
import { ActionResponse, MessageAction, MessageData } from './types';
import { tryReadLocalStorage, tryWriteLocalStorage } from './utils/Storage';
import { injectSidebar } from './utils/InjectScript';
import {
  // createSelectionAtRange,
  hackyDeserializeRange,
  getSelectionInfo,
  highlightText,
  removeHighlight,
  serializeRange,
} from './utils/Highlighting';

let collab: IHighlightCollection | null = null;

// TODO: Support user configured collab relay
const collabRelayUrl = 'http://localhost:7070';

const collabRelay = new CollabRelayClient(
  'wss://mockcollabrelay',
  1,
  collabRelayUrl
);

const keypair = (await browserSourceNostrId()) || createEphemeralNostrId();

const meta = await fetchNostrUserMetadata(keypair.pubkey, [collabRelay], {});

/**
 * Sends a message to background script to confirm if loaded tabs have content script
 */
chrome.runtime.sendMessage({ action: 'content_script_loaded' });

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
      case MessageAction.LOAD_COLLAB:
        if (collab) {
          outcome = {
            success: true,
            data: 'Collab already loaded',
          } as ActionResponse;
          break;
        }

        let storageKey = await sha256Hash(request.data);
        let knownCollabId = await tryReadLocalStorage<string>(storageKey);

        try {
          const { collabModel, collabId } =
            await loadCollabModel<IHighlightCollectionAppModel>(
              { keypair, meta },
              collabRelay,
              new HighlightContainerRuntimeFactory(),
              knownCollabId
            );

          collab = collabModel.highlightCollection;
          await tryWriteLocalStorage<string>(storageKey, collabId);
        } catch (e) {
          outcome = {
            success: false,
            error: e,
          } as ActionResponse;

          return collab;
        }

        if (collab) {
          const highlightsChangeListener = async () => {
            const highlights = await collab!.getHighlights();

            // Request render highlights on canvas
            await renderHighlightsOnCanvas(highlights);
          };

          // Set up listener for changes to the highlight collection
          collab.on(HighlightCollectionUpdate, highlightsChangeListener);
          await highlightsChangeListener();

          outcome = {
            success: true,
          } as ActionResponse;
          break;
        }

        break;

      case MessageAction.GET_COLLAB_HIGHLIGHTS:
        if (collab !== null) {
          outcome = await collab
            .getHighlights()
            .then((highlights) => {
              return (outcome = {
                success: true,
                data: highlights,
              } as ActionResponse);
            })
            .catch((e) => {
              return (outcome = {
                success: false,
                error: e,
              } as ActionResponse);
            });
          break;
        }

        outcome = {
          success: false,
          error: 'Collab not ready',
        } as ActionResponse;
        break;

      case MessageAction.TOGGLE_HIGHLIGHTS:
        if (request.data) {
          // TODO: render all highlights
        } else {
          // TODO: remove all highlights
        }
        outcome = { success: true };
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

const renderHighlightsOnCanvas = async (highlights: Highlight[]) => {
  const selection = document.getSelection();

  if (!selection) {
    return;
  }

  highlights.forEach(async ({ range: rangeStr, text }) => {
    try {
      const range = hackyDeserializeRange(rangeStr, text);
      selection.addRange(range);
      await highlightText(selection, range, text);
      selection.removeRange(range);
    } catch (e) {
      console.error(e);
    }
  });
};

const trySaveHighlight = async (
  range: ISerializedRange,
  text: string
): Promise<ActionResponse> => {
  if (collab === null) {
    return {
      success: false,
      error: 'Collab model not ready',
    } as ActionResponse;
  }

  try {
    const highlight = await Highlight.create(text, range, '0x000000');
    await collab.addHighlight(highlight);
    return { success: true };
  } catch (e) {
    return { success: false, error: e } as ActionResponse;
  }
};
