import React from 'react';
import styled from 'styled-components';
import { IHighlight } from '../../types';
import { useCollabHighlights } from '../../utils';

const Text = styled.p<{ isFirst: boolean }>`
  text-align: left;
  padding: 12px;
  font-style: italic;
  border-bottom: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
  border-top: ${({ isFirst, theme }) =>
    isFirst ? `1px solid ${theme.palette.lightGray}` : ''};
`;

export function HomeHighlights() {
  const [highlights] = useCollabHighlights();

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
    </>
  );
}

type HighlightViewProps = Pick<IHighlight, 'text' | 'author'> & {
  isFirst: boolean;
};

const HighlightView = ({ text, isFirst }: HighlightViewProps) => {
  return <Text isFirst={isFirst}>{text}</Text>;
};
