import { useCallback, useEffect, useState } from "react";
import { StorageKey, MessageAction } from "../types";
import { readLocalStorage, tryWriteLocalStorage } from "../utils/Storage";
import { sendMessage } from "../utils/Messaging";

export const useShowHighlights = () => {
    const [showHighlights, setShowHighlights] = useState(false);
  
    const toggleShowHighlights = useCallback((showHighlights: boolean) => {
      // Update state and local storage
      setShowHighlights(showHighlights);
      tryWriteLocalStorage(StorageKey.SHOW_HIGHLIGHTS, showHighlights);
  
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [showHighlights, toggleShowHighlights] as const;
};