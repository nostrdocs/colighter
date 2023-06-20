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
            setHighlights(data as IHighlight[]);
          }
        })
        .catch((e) => {
          console.error('Failed to get highlights', e);
        });
    };

    pollHighlights();
    const timer = setInterval(pollHighlights, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return [highlights] as const;
};
