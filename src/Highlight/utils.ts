import browser, { Tabs } from "webextension-polyfill";
import { ColorDescription, MessageAction, MessageData } from "../Nostr";
export const sendMessage = (data: MessageData) => {
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
};

export const setupColorUsage = (colorOptions: ColorDescription[]) => {
	let selectedColor: string;

	// Load selected color data from local storage
	browser.storage.local.get().then((store) => {
		selectedColor = store.selected_color || colorOptions[0].val;
		const selectedBtn = document.getElementById(`${selectedColor}`) as HTMLInputElement;

		sendMessage({
			action: MessageAction.SET_COLOR,
			data: { color: selectedColor },
		});

		if (selectedBtn != null) selectedBtn.checked = true;
	});

	const colorButtonGroup = document.getElementById("color-row");
	const colorButtons = document.querySelectorAll('input[name="color"]');

	if (colorButtonGroup != null) {
		colorButtonGroup.addEventListener("click", () => {
			for (const colorButton of colorButtons as any) {
				if (colorButton.checked) {
					const colorSelection = colorButton.getAttribute("value");
					browser.storage.local.set({
						selected_color: colorSelection,
					});
					sendMessage({
						action: MessageAction.SET_COLOR,
						data: { color: colorSelection },
					});
				}
			}
		});
	}
};

export const setupHighlighting = () => {
	let highlightStatus = false;
	const toggleHighlightBtn = document.getElementById("toggle-highlight") as HTMLInputElement;

	// Load value from local storage
	browser.storage.local.get().then((store) => {
		highlightStatus = store.highlight_status || false;

		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHT,
			data: { highlightStatus: highlightStatus },
		});
		toggleHighlightBtn.checked = highlightStatus;
	});

	// Enable/Disable highlighting on toggle button click
	toggleHighlightBtn.addEventListener("click", () => {
		highlightStatus = !highlightStatus;
		browser.storage.local.set({ highlight_status: highlightStatus });

		sendMessage({
			action: MessageAction.TOGGLE_HIGHLIGHT,
			data: { highlightStatus: highlightStatus },
		});
	});
};
