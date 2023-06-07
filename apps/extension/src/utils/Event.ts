import { MessageAction } from '../types';

export function handleSidebar(action: MessageAction) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, {
        action,
      });
      window.close();
      return;
    }
  });
}

export function openSettings() {
  chrome.runtime.openOptionsPage();
  window.close();
}
