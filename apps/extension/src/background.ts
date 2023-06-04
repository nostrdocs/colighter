import { MessageAction } from './types';

let loadedTabs = new Set();

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'content_script_loaded') {
    loadedTabs.add(sender.tab?.id);
  }
});

chrome.runtime.onInstalled.addListener((details) => {
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

  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://colighter.com/' });
  }

  if (details.reason === 'install' || details.reason === 'update') {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      for (let tab of tabs) {
        if (!tab.id || !tab.url) return;
        try {
          // check if tab is not a chrome:// tab and if it has loaded the content script
          if (!tab.url.startsWith('chrome://')) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                files: ['build/colighter.bundle.js'],
              },
              () => {
                loadCollab(tab.id);
              }
            );
          }
        } catch (err) {
          console.log('Failed to inject content script', err);
        }
      }
    });
  }
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

chrome.tabs.onUpdated.addListener((tabId) => loadCollab(tabId));

chrome.tabs.onActivated.addListener(({ tabId }) => loadCollab(tabId));

async function loadCollab(tabId: number | undefined) {
  if (tabId === undefined) return;
  const tab = await chrome.tabs.get(tabId);
  if (tab.status === 'complete') {
    chrome.tabs
      .sendMessage(tabId, {
        action: MessageAction.LOAD_COLLAB,
        data: tab.url || '',
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
