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
            const isDataWithText =
              data.length > 0 &&
              data.every((highlight: Partial<IHighlight>) => highlight?.text);
            if (isDataWithText) {
              setHighlights(data as IHighlight[]);
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
