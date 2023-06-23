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
        <HighlightView {...highlight} key={highlight.id} />
      ))}
      {
        <AvatarGroup mt={4} size='md' max={3}>
          {highlights.map(({ author, id }) => (
            <Avatar name={author} src='https://bit.ly/code-beast' key={id} />
          ))}
        </AvatarGroup>
      }
    </>
  );
}

type HighlightViewProps = Pick<IHighlight, 'text' | 'author' | 'id'>;

const HighlightView = ({ text, id }: HighlightViewProps) => {
  return (
    <Box
      key={id}
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
