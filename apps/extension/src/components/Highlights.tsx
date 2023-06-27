import React, { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

import { useNostrHighlights } from '../hooks/useNostrHighlights';
import { IHighlight } from '../types';
import { theme } from '../theme';
import { convertUnixTimestampToDate } from '../utils/unixConverter';
import { useSettings } from '../context/settingsContext';

type HighlightsProps = {
  showRecentOnly?: boolean;
};

export function Highlights({ showRecentOnly }: HighlightsProps) {
  const [highlights] = useNostrHighlights();
  const highlightsToShow = showRecentOnly ? highlights.slice(0, 1) : highlights;
  console.log(highlights, 'hightds showing');
  return (
    <>
      {highlightsToShow.map((highlight) => (
        <HighlightView {...highlight} key={highlight.id} />
      ))}
    </>
  );
}

type HighlightViewProps = Pick<
  IHighlight,
  'text' | 'author' | 'id' | 'created_at'
>;

const HighlightView = ({
  text,
  id,
  author,
  created_at,
}: HighlightViewProps) => {
  const { settings } = useSettings();
  const [nostrId, setNostrId] = useState<{
    privkey: string;
    pubkey: string;
  } | null>(null);

  useEffect(() => {
    settings
      .getNostrIdentity()
      .then((id) => {
        setNostrId(id);
      })
      .catch((err) => {
        // Show error message
        console.log(err);
      });
  }, [settings]);
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
      <Flex
        padding={'12px'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        {/* i don't know if this is the best way to handle it  
           most times the author is an empty string?
        */}
        {(author || nostrId?.pubkey) && (
          <Avatar name={author || nostrId?.pubkey} width={25} height={25} />
        )}
        {created_at && (
          <Text color={theme.palette.secondaryTint} fontWeight={700}>
            {convertUnixTimestampToDate(created_at)}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
