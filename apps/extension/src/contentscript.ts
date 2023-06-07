import {
  Highlight,
  HighlightCollectionUpdate,
  IHighlightCollection,
  IHighlightCollectionAppModel,
  HighlightContainerRuntimeFactory,
  serializeRange,
  sha256Hash,
} from 'colighter';
import { CollabRelayClient, loadCollabModel } from 'nostrcollab';
import {
  browserSourceNostrId,
  createEphemeralNostrId,
  fetchNostrUserMetadata,
} from 'nostrfn';
import { ActionResponse, MessageAction, MessageData } from './types';
import { tryReadLocalStorage, tryWriteLocalStorage } from './utils/Storage';
import { sendMessage } from './utils/Messaging';
import { injectSidebar } from './utils/InjectScript';

const HIGHLIGHT_KEY: string = 'NPKryv4iXxihMRg2gxRkTfFhwXmNmX9F';
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
    sender: chrome.runtime.MessageSender,
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
            chrome.runtime
              .sendMessage({
                action: MessageAction.RENDER_HIGHLIGHTS,
                data: highlights,
              })
              .catch((e) => {
                console.error(e);
              });

            // Request render of highlights on popup UI
            chrome.runtime
              .sendMessage({
                action: MessageAction.POST_COLLAB_HIGHLIGHTS,
                data: highlights,
              })
              .catch((e) => {
                console.error(e);
              });
          };

          // Set up listener for changes to the highlight collection
          collab.on(HighlightCollectionUpdate, highlightsChangeListener);

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
        } else {
          // Trigger collab load
          sendMessage({
            action: MessageAction.LOAD_COLLAB,
            data: sender.tab?.url || '',
          });
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

      case MessageAction.RENDER_HIGHLIGHTS:
        if (request.data) {
          // We don't know how to render collab highlights yet
          // TODO: Render submitted highlights
          outcome = {
            success: false,
            error: 'Not implemented',
          } as ActionResponse;
          break;
        }

        outcome = await highlightText().catch((e) => {
          return (outcome = {
            success: false,
            error: e,
          } as ActionResponse);
        });
        break;

      case MessageAction.REMOVE_HIGHLIGHTS:
        outcome = removeHighlight();
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

const getSelectionInfo = (): {
  selection: Selection | null;
  range: Range | null;
  text: string;
} => {
  const selection = window.getSelection();
  let range: Range | null = null;
  let text = '';

  if (selection) {
    range = selection.getRangeAt(0);
    text = range.toString();
  }
  return { selection, range, text };
};

/* Highlight given selection */
const highlightText = async (): Promise<ActionResponse> => {
  const { selection, range, text } = getSelectionInfo();

  if (selection === null || range === null) {
    return {
      success: false,
      error: 'Failed to get selection',
    } as ActionResponse;
  }

  if (!text) {
    return { success: false, error: 'No text selected' } as ActionResponse;
  }

  let parent = getHighlightedMark(selection);

  if (parent?.className !== HIGHLIGHT_KEY) {
    let mark: HTMLElement = document.createElement('mark');
    mark.setAttribute('style', `background-color: #CE97FB`);
    mark.className = HIGHLIGHT_KEY;
    let sel: Selection | null = window.getSelection();

    if (sel?.rangeCount) {
      let range: Range = sel.getRangeAt(0).cloneRange();
      range.surroundContents(mark);
      sel.removeAllRanges();
      sel.addRange(range);

      return await trySaveHighlight(range, text);
    }
  }

  return { success: false, error: 'Already highlighted' } as ActionResponse;
};

/* Remove highlight for given selected text */
const removeHighlight = (): ActionResponse => {
  const { selection, range, text } = getSelectionInfo();

  if (selection === null || range === null) {
    return {
      success: false,
      error: 'Failed to get selection',
    } as ActionResponse;
  }

  if (!text) {
    return { success: false, error: 'No text selected' } as ActionResponse;
  }

  let mark = getHighlightedMark(selection);

  if (mark?.className === HIGHLIGHT_KEY) {
    let parent: Node | null = mark.parentNode;
    let text: Text | null = document.createTextNode(mark.innerHTML);

    parent?.insertBefore(text, mark);
    mark.remove();

    return { success: true };
  }

  return {
    success: false,
    error: 'Failed to remove highlight',
  } as ActionResponse;
};

/* Get parent element from selected text */
const getHighlightedMark = (selection: Selection): HTMLElement | null => {
  let parent: HTMLElement | null = null;
  parent = selection.getRangeAt(0).commonAncestorContainer as HTMLElement;
  if (parent.nodeType !== 1) {
    parent = parent.parentNode as HTMLElement;
  }
  return parent;
};

const trySaveHighlight = async (
  range: Range,
  text: string
): Promise<ActionResponse> => {
  if (collab === null) {
    return {
      success: false,
      error: 'Collab model not ready',
    } as ActionResponse;
  }

  try {
    const rangeSer = serializeRange(range);
    const highlight = await Highlight.create(text, rangeSer, '0x000000');
    await collab.addHighlight(highlight);
    return { success: true };
  } catch (e) {
    return { success: false, error: e } as ActionResponse;
  }
};
