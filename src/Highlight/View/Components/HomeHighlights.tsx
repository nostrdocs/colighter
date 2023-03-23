import React, { useCallback } from "react";
import styled from "styled-components";
import { Highlight } from "../../model";
import { IHighlight } from "../../types";
import { useCollabHighlights } from "../../utils";

const Text = styled.p<{ isFirst: boolean }>`
	text-align: left;
	padding: 12px;
	font-style: italic;
	border-bottom: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
	border-top: ${({ isFirst, theme }) => (isFirst ? `1px solid ${theme.palette.lightGray}` : "")};
`;

export function HomeHighlights() {
	const [highlights, setHighlights] = useCollabHighlights();

	const createNewHighlight = useCallback(async () => {
		let highlight = await Highlight.create("gru", `mock highlight #${highlights.length}`);
		setHighlights([...highlights, highlight]);
	}, [highlights]);

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
