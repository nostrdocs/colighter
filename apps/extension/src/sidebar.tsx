import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider, CSSReset } from '@chakra-ui/react';

import { Sidebar } from './components/Sidebar';
import { SidebarProvider, useSidebar } from './context/sidebarContext';
import { chakraTheme } from './theme';
import { MessageAction } from './types';

const SidebarApp = () => {
  const { toggleSidebar, closeIframeSidebar } = useSidebar();
  React.useEffect(() => {
    function handleMessage(message: { action: MessageAction }) {
      if (message.action === MessageAction.OPEN_SIDEBAR) {
        toggleSidebar();
      }
      if (message.action === MessageAction.CLOSE_SIDEBAR) {
        closeIframeSidebar();
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [toggleSidebar, closeIframeSidebar]);
  return (
    <ChakraProvider theme={chakraTheme}>
      <CSSReset />
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('sidebar-root')!);

root.render(<SidebarApp />);
