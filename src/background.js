// import { initialize } from './Background/index.js';

// // NOTE: This file must be in the top-level directory of the extension according to the docs

// initialize();

chrome.contextMenus.create({
  id: 'highlight-selection',
  title: 'Highlight',
  contexts: ['selection'],
});

chrome.contextMenus.create({
  id: 'remove-selection',
  title: 'Remove Highlight',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'highlight-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'HIGHLIGHT' });
    });
  } else if (info.menuItemId === 'remove-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'REMOVE_HIGHLIGHT' });
    });
  }
});

