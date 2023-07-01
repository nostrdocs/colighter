import React, { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

import { useNostrHighlights } from '../hooks/useNostrHighlights';
import { IHighlight } from '../types';
import { theme } from '../theme';
import { convertUnixTimestampToDate } from '../utils/unixConverter';
import { useSettings } from '../context/settingsContext';

type HighlightsProps = {
  showRecentOnly?: boolean;
  myHighlights?: boolean;
};

export function Highlights({ showRecentOnly, myHighlights }: HighlightsProps) {
  const [highlights] = useNostrHighlights();
  const { settings } = useSettings();
  const [pubKey, setPubKey] = useState<string>();

  useEffect(() => {
    settings.getNostrIdentity().then((id) => setPubKey(id.pubkey));
  }, [settings]);
  const highlightsToShow = showRecentOnly
    ? highlights.slice(0, 1)
    : myHighlights
    ? highlights.filter((highlight) => highlight.author === pubKey)
    : highlights;
  return (
    <>
      {highlightsToShow
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .map((highlight,index) => (
          <HighlightView {...highlight} key={highlight.id || index} />
        ))}
    </>
  );
}

type HighlightViewProps = Pick<
  IHighlight,
  'text' | 'author' | 'id' | 'createdAt'
>;

const HighlightView = ({ text, id, author, createdAt }: HighlightViewProps) => {
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
        {(author || nostrId?.pubkey) && <Avatar width={25} height={25} />}
        {createdAt && (
          <Text color={theme.palette.secondaryTint} fontWeight={700}>
            {convertUnixTimestampToDate(createdAt)}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
