const background = () => {
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

	chrome.contextMenus.onClicked.addListener((info, tab) =>{
		if (info.menuItemId === "highlight-selection") {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) =>{
				chrome.tabs.sendMessage(tabs[0].id!, { action: "HIGHLIGHT" });
			});
		} else if (info.menuItemId === "remove-selection") {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
				chrome.tabs.sendMessage(tabs[0].id!, { action: "REMOVE_HIGHLIGHT" });
			});
		}
	});
};

background();
