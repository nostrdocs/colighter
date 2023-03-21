chrome.runtime.sendMessage("I am loading content script", (response) => {
	console.log(response);
	console.log("I am content script");
});

chrome.contextMenus.create({
	id: "highlight-selection",
	title: "Highlight",
	contexts: ["selection"],
});

chrome.contextMenus.create({
	id: "remove-selection",
	title: "Remove Highlight",
	contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	const currentTab = tab?.id;

	if (!currentTab) return;

	if (info.menuItemId === "highlight-selection") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(currentTab, { action: "HIGHLIGHT" });
		});
	} else if (info.menuItemId === "remove-selection") {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(currentTab, { action: "REMOVE_HIGHLIGHT" });
		});
	}
});
