import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react';

import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { useSidebar } from '../context/context';
import { handleSidebar } from '../utils/Event';
import { theme } from '../theme';
import { Highlights } from './Highlights';
import { PartialKeyPair, browserSourceNostrId } from 'nostrfn';
import { MessageAction } from '../types';

export function Popup() {
  const { toggleSidebar } = useSidebar();
  const [nostrId, setNostrId] = useState<PartialKeyPair | null>(null);
  const [showCreateButton, setShowCreateButton] = useState<boolean>(true);

  const handleCreateNostrId = useCallback(async () => {
    const newNostrId = await browserSourceNostrId();
    setNostrId(newNostrId);
    localStorage.setItem('nostrKeys', JSON.stringify(newNostrId));
    setShowCreateButton(false);
    // console.log(newNostrId);
  }, []);

  useEffect(() => {
    const storedNostrKeys = localStorage.getItem('nostrKeys');
    if (storedNostrKeys) {
      const parsedKeys = JSON.parse(storedNostrKeys);
      setNostrId(parsedKeys);
      setShowCreateButton(false);
      // console.log(parsedKeys);
    }
  }, []);
  return (
    <Flex
      overflow='hidden'
      gap={30}
      width={400}
      borderRadius={12}
      flexDir='column'
      border={`1px solid ${theme.palette.lightGray}`}
      p='16px'
    >
      <Flex justifyContent='space-between'>
        <Image src={`${Colighter}`} alt='colighter-logo' />
        <Image src={`${Gear}`} alt='gear-icon' />
        {showCreateButton ? (
          <button onClick={handleCreateNostrId}>Create NostrId</button>
        ) : null}
      </Flex>
      <Box>
        <div>Your npub is: {nostrId ? nostrId.pubkey.toString() : 'N/A'}</div>
        <Heading as='h5' fontWeight='500' m={0} mb='12px'>
          Your Highlights
        </Heading>
        <Highlights />
      </Box>
      <Button
        variant='popup'
        onClick={() => {
          handleSidebar(MessageAction.OPEN_SIDEBAR);
          toggleSidebar();
        }}
      >
        Open sidebar to see your highlights
      </Button>
    </Flex>
  );
}
