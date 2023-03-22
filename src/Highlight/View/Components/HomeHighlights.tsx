import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Highlight } from "../../model";
import { IHighlight, IHighlightCollection } from "../../types";

const Text = styled.p<{ isFirst: boolean }>`
	text-align: left;
	padding: 12px;
	font-style: italic;
	border-bottom: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
	border-top: ${({ isFirst, theme }) => (isFirst ? `1px solid ${theme.palette.lightGray}` : "")};
`;

type HomeHighlightsProps = {
	collab: IHighlightCollection;
	renderHighlightsOnCanvas: (highlights: IHighlight[]) => void;
};

export function HomeHighlights({ collab, renderHighlightsOnCanvas }: HomeHighlightsProps) {
	const [highlights, setHighlights] = useState<IHighlight[]>([]);

	const updateHighlights = useCallback(async (highlights: IHighlight[]) => {
		renderHighlightsOnCanvas(highlights);
		setHighlights(highlights);
	}, []);

	const createNewHighlight = useCallback(async () => {
		let highlight = await Highlight.create("gru", `mock highlight #${highlights.length}`);
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
			{highlights.map((highlight, index) => (
				<HighlightView
					text={highlight.text}
					author={highlight.author}
					key={highlight.hashId}
					isFirst={index === 0}
				/>
			))}
			<input
				type="button"
				value="Create Mock Highlight"
				onClick={() => createNewHighlight()}
			/>
		</>
	);
}

type HighlightViewProps = Pick<IHighlight, "text" | "author"> & {
	isFirst: boolean;
};

const HighlightView = ({ text, isFirst }: HighlightViewProps) => {
	return <Text isFirst={isFirst}>{text}</Text>;
};
