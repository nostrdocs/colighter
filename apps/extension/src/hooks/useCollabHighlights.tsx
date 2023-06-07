import { IHighlight } from 'colighter';
import { useState, useEffect } from 'react';
import {
  MessageAction,
  MessageData,
  ActionResponse,
  SucccessAcionResponse,
} from '../types';
import { sendMessage } from '../utils/Messaging';

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

    const highlightListener = (
      message: MessageData<IHighlight[]>,
      _sender: any,
      _sendResponse: any
    ) => {
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
