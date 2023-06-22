import React from 'react';
import { handleSidebar } from '../utils/Event';
import { MessageAction } from '../types';

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeIframeSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContextType>({
  isOpen: false,
  toggleSidebar: () => {},
  closeIframeSidebar: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggleSidebar = React.useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const closeIframeSidebar = React.useCallback(() => {
    handleSidebar(MessageAction.CLOSE_SIDEBAR);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, closeIframeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
