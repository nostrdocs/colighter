import React from 'react';
import { Avatar,  Box, Flex, Text } from '@chakra-ui/react';

import { useNostrHighlights } from '../hooks/useNostrHighlights';
import { IHighlight } from '../types';
import { theme } from '../theme';
import { convertUnixTimestampToDate } from '../utils/unixConverter';

type HighlightsProps = {
  showRecentOnly?: boolean;
};

export function Highlights({ showRecentOnly }: HighlightsProps) {
  const [highlights] = useNostrHighlights();
  const highlightsToShow = showRecentOnly ? highlights.slice(0, 1) : highlights;
  console.log(highlights,"hightds showing")
  return (
    <>
      {highlightsToShow.map((highlight) => (
        <HighlightView {...highlight} key={highlight.id} />
      ))}
    </>
  );
}

type HighlightViewProps = Pick<IHighlight, 'text' | 'author' | 'id' | "created_at">;

const HighlightView = ({ text, id, author, created_at  }: HighlightViewProps) => {
  // convertUnixTimestampToDate()
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
      <Flex padding={"12px"} justifyContent={"space-between"} alignItems={"center"}>
        {author && <Avatar name={author} width={25} height={25}/>}
        {created_at && <Text color={theme.palette.secondaryTint} fontWeight={700}>{convertUnixTimestampToDate(created_at)}</Text>}
      </Flex>
    </Box>
  );
};
