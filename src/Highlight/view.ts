import { IHighlight, IHighlightCollection } from "./interfaces";
import { Highlight } from "./model";

export const renderHighlightCollection = (
	collection: IHighlightCollection,
	div: HTMLElement,
	author: string,
) => {
	const titleDiv = document.createElement("div");
	const renderTitle = () => {
		collection.getHighlightBase().then((base) => {
			titleDiv.textContent = `Highlight Collection for ${base}`;
		});
	};
	renderTitle();

	const highlightsDiv = document.createElement("div");

	// Pre-render all the highlights
	const renderHighlights = () => {
		highlightsDiv.innerHTML = "";
		collection.getHighlights().then((highlights) => {
			highlights.forEach((highlight) => renderHighlight(highlight, highlightsDiv));
		});
	};
	renderHighlights();

	// Re-render highlights when the collection changes : because a highlight is added, or removed
	collection.on("highlightCollectionChanged", renderHighlights);

	// Placeholder UX for creating highlights
	const addHighlightDiv = document.createElement("div");

	const inpt = document.createElement("input");
	inpt.placeholder = "Highlight Text";

	const btn = document.createElement("button");
	btn.textContent = "Create";
	btn.addEventListener("click", async () => {
		const text = inpt.value;

		const highlight = await Highlight.create(author, text);
		await collection.addHighlight(highlight);

		inpt.value = "";
	});

	addHighlightDiv.append(inpt, btn);

	// Inject the pre-rendered highlights as a list into the DOM
	div.append(titleDiv, highlightsDiv, addHighlightDiv);
};

const renderHighlight = (highlight: IHighlight, div: HTMLDivElement) => {
	const highlightDiv = document.createElement("div");
	highlightDiv.textContent = `${highlight.text}\n authored by : ${highlight.author}`;

	div.append(highlightDiv);
};
