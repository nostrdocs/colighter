//test
chrome.runtime.sendMessage('I am loading content script', (response) => {
  console.log(response);
  console.log('I am content script')

})

window.onload = (event: any) => {
  console.log('page is fully loaded');
};

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
     let t = tabs[0]
      chrome.tabs.sendMessage(tabs[0].id, { action: 'HIGHLIGHT' });
    });
  } else if (info.menuItemId === 'remove-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'REMOVE_HIGHLIGHT' });
    });
  }
});

