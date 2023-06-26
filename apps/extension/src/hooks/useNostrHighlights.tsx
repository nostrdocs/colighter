import { useState, useEffect } from 'react';
import {
  IHighlight,
  MessageAction,
  ActionResponse,
  SucccessAcionResponse,
} from '../types';
import { sendMessage } from '../utils/Messaging';

export const useNostrHighlights = () => {
  const [highlights, setHighlights] = useState<IHighlight[]>([]);

  useEffect(() => {
    const pollHighlights = () => {
      // Request for collab highlights
      sendMessage<null>({
        action: MessageAction.GET_HIGHLIGHTS,
        data: null,
      })
        .then((outcome: ActionResponse) => {
          if (outcome?.success) {
            const data = (outcome as SucccessAcionResponse).data;
            // Check if every highlight has a text property before setting
            const isAllDataWithText = data.every(highlight => highlight?.text)
            if(isAllDataWithText && data.length > 0 ){
             setHighlights(data as IHighlight[]);
             return;
            }
          }
        })
        .catch((e) => {
          console.error('Failed to get highlights', e);
        });
    };

    pollHighlights();
    const timer = setInterval(pollHighlights, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return [highlights] as const;
};
