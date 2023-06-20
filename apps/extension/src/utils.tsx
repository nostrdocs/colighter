import { useCallback, useEffect, useState } from 'react';
import chrome, { Tabs } from 'webextension-polyfill';
import { IHighlight } from 'colighter';
import {
  MessageAction,
  MessageData,
  StorageKey,
  ActionResponse,
  SucccessAcionResponse,
} from './types';

export const tryReadLocalStorage = async <T,>(
  key: string
): Promise<T | undefined> => {
  const storage = await chrome.storage.local.get();
  return storage[key];
};

const readLocalStorage = async <T,>(
  key: StorageKey
): Promise<T | undefined> => {
  return tryReadLocalStorage<T>(key);
};

export const tryWriteLocalStorage = async <T,>(key: string, value: T) => {
  await chrome.storage.local.set({ [key]: value });
};

export const writeLocalStorage = async <T,>(key: StorageKey, value: T) => {
  return tryWriteLocalStorage<T>(key, value);
};

export const sendMessage = async <T,>(
  data: MessageData<T>
): Promise<ActionResponse> => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs: Tabs.Tab[] = await chrome.tabs.query(queryOptions);
  const currentTabId = tabs[0]?.id;

  if (currentTabId !== undefined) {
    return chrome.tabs.sendMessage(currentTabId, data);
  }

  return {
    success: false,
    error: 'Failed to send message. Unknown tab id',
  } as ActionResponse;
};

export const useShowHighlights = () => {
  const [showHighlights, setShowHighlights] = useState(false);

  const toggleShowHighlights = useCallback((showHighlights: boolean) => {
    // Update state and local storage
    setShowHighlights(showHighlights);
    writeLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);

    // Send message for render action by content script
    sendMessage({
      action: MessageAction.TOGGLE_HIGHLIGHTS,
      data: showHighlights,
    }).catch((e) => {
      console.log('Failed to send message', e);
    });
  }, []);

  useEffect(() => {
    readLocalStorage<boolean>(StorageKey.SHOW_HIGHLIGHTS)
      .then((storedShowHighlights) => {
        // Update state
        let updatedShowHighlights = storedShowHighlights ?? showHighlights;
        toggleShowHighlights(updatedShowHighlights);
      })
      .catch((e) => {
        console.log('Failed to read local storage', e);
      });
  }, []);

  return [showHighlights, toggleShowHighlights] as const;
};

export const useCollabHighlights = () => {
  const [highlights, setHighlights] = useState<IHighlight[]>([]);

  useEffect(() => {
    // Request for collab highlights
    sendMessage<null>({
      action: MessageAction.GET_COLLAB_HIGHLIGHTS,
      data: null,
    })
      .then((outcome: ActionResponse) => {
        if (outcome.success) {
          const data = (outcome as SucccessAcionResponse).data;
          setHighlights(data as IHighlight[]);
        }
      })
      .catch((e) => {
        console.error('Failed to get highlights', e);
      });

    const highlightListener = (message, _sender, _sendResponse) => {
      if (
        message.action !== MessageAction.POST_COLLAB_HIGHLIGHTS ||
        !message.data
      ) {
        return;
      }

      setHighlights(message.data as IHighlight[]);
    };

    chrome.runtime.onMessage.addListener(highlightListener);

    return () => {
      chrome.runtime.onMessage.removeListener(highlightListener);
    };
  }, []);

  return [highlights, setHighlights] as const;
};
