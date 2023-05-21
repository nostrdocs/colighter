import { MessageAction } from './types';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'create-highlight',
    title: 'Create Highlight',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'remove-highlight',
    title: 'Remove Highlight',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    let tabId = tab?.id;
    if (tabId === undefined) return;

    if (info.menuItemId === 'create-highlight') {
      chrome.tabs
        .sendMessage(tabId, { action: MessageAction.RENDER_HIGHLIGHTS })
        .catch((err) => {
          console.log(err);
        });

      return;
    }

    if (info.menuItemId === 'remove-highlight') {
      chrome.tabs
        .sendMessage(tabId, { action: MessageAction.REMOVE_HIGHLIGHTS })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  });

  chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'create-highlight') {
      tab.id !== undefined &&
        chrome.tabs
          .sendMessage(tab.id, { action: MessageAction.RENDER_HIGHLIGHTS })
          .catch((err) => {
            console.log(err);
          });
    }
  });

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Load collab whenever on fully loaded tabs
    if (changeInfo.status === 'complete') {
      chrome.tabs
        .sendMessage(tabId, {
          action: MessageAction.LOAD_COLLAB,
          data: tab.url || '',
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});
