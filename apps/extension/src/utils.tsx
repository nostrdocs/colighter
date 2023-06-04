import { useCallback, useEffect, useState } from 'react';
import browser, { Tabs } from 'webextension-polyfill';
import { IHighlight } from 'colighter';
import {
  ColorDescription,
  MessageAction,
  MessageData,
  StorageKey,
  ActionResponse,
  SucccessAcionResponse,
  DEFAULT_HIGHLIGHT_COLOR,
} from './types';

export const tryReadLocalStorage = async <T,>(key: string): Promise<T | undefined> => {
  const storage = await browser.storage.local.get();
  return storage[key];
};

const readLocalStorage = async <T,>(
  key: StorageKey
): Promise<T | undefined> => {
  return tryReadLocalStorage<T>(key);
};

export const tryWriteLocalStorage = async <T,>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value });
};

export const writeLocalStorage = async <T,>(key: StorageKey, value: T) => {
  return tryWriteLocalStorage<T>(key, value);
};

export const sendMessage = async <T,>(
  data: MessageData<T>
): Promise<ActionResponse> => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs: Tabs.Tab[] = await browser.tabs.query(queryOptions);
  const currentTabId = tabs[0]?.id;

  if (currentTabId !== undefined) {
    return browser.tabs.sendMessage(currentTabId, data);
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

export const useColorSelectedColor = () => {
  const [selectedColor, setSelectedColor] = useState<ColorDescription>(
    DEFAULT_HIGHLIGHT_COLOR
  );

  const updateSelectedColor = useCallback(
    async (selectedColor: ColorDescription) => {
      // Send message for render action by content script
      await sendMessage<ColorDescription>({
        action: MessageAction.SELECT_COLOR,
        data: selectedColor,
      }).catch((e) => {
        console.log('Failed to set selected color', e);
      });

      // Update state and local storage
      writeLocalStorage<ColorDescription>(
        StorageKey.COLOR_SELECTION,
        selectedColor
      );

      setSelectedColor(selectedColor);
    },
    []
  );

  useEffect(() => {
    readLocalStorage<ColorDescription>(StorageKey.COLOR_SELECTION)
      .then((storedSelectedColor) => {
        // Update state
        const updatedSelectedColor = storedSelectedColor || selectedColor;
        setSelectedColor(updatedSelectedColor);
      })
      .catch((e) => {
        console.log('Failed to read local storage', e);
      });
  }, []);

  return [selectedColor, updateSelectedColor] as const;
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
