import { IHighlight, IHighlightCollection } from "./interfaces";

export const renderHighlightCollection = (
	collection: IHighlightCollection,
	div: HTMLDivElement,
) => {
	const highlightsDiv = document.createElement("div");

	// Pre-render all the highlights
	const renderHighlights = () => {
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
	btn.textContent = "Add";

	addHighlightDiv.append(inpt, btn);

	// Inject the pre-rendered highlights as a list into the DOM
	div.append(highlightsDiv, addHighlightDiv);
};

const renderHighlight = (highlight: IHighlight, div: HTMLDivElement) => {
	const highlightDiv = document.createElement("div");
	highlightDiv.textContent = `${highlight.text}\n authored by : ${highlight.author}`;

	div.append(highlightDiv);
};
