import { MessageAction } from '../types';

export function openSidebar() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, {
        action: MessageAction.OPEN_SIDEBAR,
      });
      window.close();
      return;
    }
  });
}

export function closeSidebar() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, {
        action: MessageAction.CLOSE_SIDEBAR,
      });
      window.close();
      return;
    }
  });
}
