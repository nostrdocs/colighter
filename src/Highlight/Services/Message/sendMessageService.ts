import browser, { Tabs } from "webextension-polyfill";
import { MessageData } from "../../../Common/Types";

function sendMessage(data: MessageData) {
	const queryOptions = { active: true, currentWindow: true };

	browser.tabs.query(queryOptions).then((tabs: Tabs.Tab[]) => {
		const currentTab = tabs[0];
		if (currentTab.id !== undefined) {
			browser.tabs.sendMessage(currentTab.id, data).then((response) => {
				if (response.data == "ERR") {
					alert("COLIGHTER ERROR");
				}
			});
		}
	});
}

export { sendMessage };
