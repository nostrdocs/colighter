import { MessageAction } from '../types';

export function handleSidebar(action: MessageAction) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const activeTab = tabs[0];
      if (activeTab.id) {
        await chrome.tabs.sendMessage(activeTab.id, {
          action,
        });
        window.close();

        return;
      }
    }
  );
}

export function openExtensionSettings() {
  chrome.runtime.sendMessage({
    action: MessageAction.OPEN_OPTIONS_PAGE,
  });
}
