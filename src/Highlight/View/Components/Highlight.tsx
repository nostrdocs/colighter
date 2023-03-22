import React, { useCallback, useEffect, useState } from "react";
import { Highlight } from "../../model";
import { IHighlight, IHighlightCollection } from "../../types";

type HighlightViewProps = Pick<IHighlight, "text" | "author">;

const HighlightView = ({ text, author }: HighlightViewProps) => {
	return <div>{`${text} : ${author}`}</div>;
};

type HighlightListProps = {
	collab: IHighlightCollection;
	renderHighlightsOnCanvas: (highlights: IHighlight[]) => void;
};

export const HighlightList = React.memo(function HighlightList({
	collab,
	renderHighlightsOnCanvas,
}: HighlightListProps) {
	const [highlights, setHighlights] = useState<IHighlight[]>([]);

	const updateHighlights = useCallback(async (highlights: IHighlight[]) => {
		renderHighlightsOnCanvas(highlights);
		setHighlights(highlights);
	}, []);

	const createNewHighlight = useCallback(async () => {
		let highlight = await Highlight.create("sample", `test-${highlights.length}`);
		await collab.addHighlight(highlight);
	}, [highlights]);

	useEffect(() => {
		// Load any existing highlights from collab
		collab
			.getHighlights()
			.then((highlights) => {
				updateHighlights(highlights);
			})
			.catch((err) => {
				console.error(err);
			});

		const changeListener = async () => {
			const highlights = await collab.getHighlights();
			updateHighlights(highlights);
		};

		collab.on("highlightCollectionChanged", changeListener);

		return () => {
			collab.off("highlightCollectionChanged", changeListener);
		};
	}, []);

	return (
		<>
			{highlights.map((highlight) => (
				<HighlightView
					text={highlight.text}
					author={highlight.author}
					key={highlight.hashId}
				/>
			))}
			<input type="button" value="Test Highlight" onClick={() => createNewHighlight()} />
		</>
	);
});
