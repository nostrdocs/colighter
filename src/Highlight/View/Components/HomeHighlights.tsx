import React from "react";
import styled from "styled-components";

const Text = styled.p<{ isFirst: boolean }>`
	text-align: left;
	padding: 12px;
	font-style: italic;
	border-bottom: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
	border-top: ${({ isFirst, theme }) => (isFirst ? `1px solid ${theme.palette.lightGray}` : "")};
`;

type HomeHighlightsProps = {
	highLights: string[];
};

export function HomeHighlights({ highLights }: HomeHighlightsProps) {
	return (
		<>
			{highLights.map((text, index) => (
				<Text isFirst={index === 0}>{text}</Text>
			))}
		</>
	);
}
