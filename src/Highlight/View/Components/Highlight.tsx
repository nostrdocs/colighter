import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { MessageData } from '../../../Common/Types';
import { sendMessage } from '../../Services/Message/sendMessageService';

interface Props {
  text: string;
  color: string;
}

const HighlightedText: React.FC<Props> = ({ text, color }) => {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const message: MessageData = {
      action: 'HIGHLIGHT_TEXT',
      data: {
        text: text,
        color: color,
      },
    };

    const toggleHighlight = () => {
      setHighlighted(!highlighted);
      sendMessage(message);
    };

    browser.runtime.onMessage.addListener((request) => {
      if (request.action === 'TOGGLE_HIGHLIGHTED_TEXT') {
        toggleHighlight();
      }
    });

    return () => {
      sendMessage({
          action: 'REMOVE_HIGHLIGHTS',
          data: ""
      });
    };
  }, [text, color, highlighted]);

  return <span className={`highlighted-text ${highlighted ? 'highlighted' : ''}`}>{text}</span>;
};

export default HighlightedText;