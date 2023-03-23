import { MessageAction } from "./types";

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create(
		{
			id: "colighter-add",
			title: "Highlight",
			contexts: ["selection"],
		},
		() => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
				chrome.tabs
					.sendMessage(tabs[0].id!, { action: MessageAction.RENDER_HIGHLIGHTS })
					.catch((err) => {
						console.log(err);
					});
			});
		},
	);

	chrome.contextMenus.create(
		{
			id: "colighter-remove",
			title: "Remove Highlight",
			contexts: ["selection"],
		},
		() => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
				chrome.tabs
					.sendMessage(tabs[0].id!, { action: MessageAction.REMOVE_HIGHLIGHTS })
					.catch((err) => {
						console.log(err);
					});
			});
		},
	);

	chrome.commands.onCommand.addListener((command, tab) => {
		if (command === "execute-highlight") {
			tab.id !== undefined &&
				chrome.tabs
					.sendMessage(tab.id, { action: MessageAction.RENDER_HIGHLIGHTS })
					.catch((err) => {
						console.log(err);
					});
		}
	});
});
