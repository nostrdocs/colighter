import React from 'react';

import { Avatar, AvatarGroup, Box, Text } from '@chakra-ui/react';

import { useNostrHighlights } from '../hooks/useNostrHighlights';
import { IHighlight } from '../types';
import { theme } from '../theme';

type HighlightsProps = {
  showRecentOnly?: boolean;
};

export function Highlights({ showRecentOnly }: HighlightsProps) {
  const [highlights] = useNostrHighlights();

  const highlightsToShow = showRecentOnly ? highlights.slice(0, 1) : highlights;

  return (
    <>
      {highlightsToShow.map((highlight) => (
        <>
          <HighlightView
            text={highlight.text}
            author={highlight.author}
            hashId={highlight.hashId}
            key={highlight.hashId}
          />
        </>
      ))}
      {
        <AvatarGroup mt={4} size='md' max={3}>
          {highlights.map(({ author, hashId }) => (
            <Avatar
              name={author}
              src='https://bit.ly/code-beast'
              key={hashId}
            />
          ))}
        </AvatarGroup>
      }
    </>
  );
}

type HighlightViewProps = Pick<IHighlight, 'text' | 'author' | 'hashId'>;

const HighlightView = ({ text, hashId }: HighlightViewProps) => {
  return (
    <Box
      key={hashId}
      mb='4'
      border={`1px solid ${theme.palette.lightGray}`}
      borderRadius='7px'
    >
      <Text textAlign='left' padding='12px' fontStyle='italic'>
        {text}
      </Text>
    </Box>
  );
};
