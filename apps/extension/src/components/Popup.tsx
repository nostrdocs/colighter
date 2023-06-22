import { browserSourceNostrId, PartialKeyPair } from 'nostrfn';
import React, { useCallback, useEffect, useState } from 'react';

import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';

import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { useSettings } from '../context/settingsContext';
import { useSidebar } from '../context/sidebarContext';
import { theme } from '../theme';
import { MessageAction } from '../types';
import { handleSidebar, openExtensionSettings } from '../utils/Event';
import { Highlights } from './Highlights';

export function Popup() {
  const { toggleSidebar } = useSidebar();
  const { settings, updateSettings } = useSettings();
  const [nostrId, setNostrId] = useState<PartialKeyPair | null>(null);

  const handleCreateNostrId = useCallback(async () => {
    const newNostrId = await browserSourceNostrId();
    if (!newNostrId) return;
    localStorage.setItem('nostrKeys', JSON.stringify(newNostrId));
    setNostrId(newNostrId);
    updateSettings({
      ...settings,
      nostrId: {
        privkey: newNostrId.privkey,
        pubkey: newNostrId.pubkey,
      },
    });
  }, [settings, updateSettings]);

  useEffect(() => {
    const storedNostrKeys = localStorage.getItem('nostrKeys');
    if (storedNostrKeys) {
      const parsedKeys = JSON.parse(storedNostrKeys);
      setNostrId(parsedKeys);
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
        <Image
          src={`${Gear}`}
          alt='gear-icon'
          onClick={openExtensionSettings}
          cursor='pointer'
        />
      </Flex>
      <Box>
        <Text fontSize='20px'>
          {nostrId
            ? 'Your recent highlights'
            : 'Create an account to start colighting'}
        </Text>
        <Highlights showRecentOnly={true} />
      </Box>
      <Button
        variant='popup'
        visibility={nostrId ? 'hidden' : 'visible'}
        onClick={() => {
          handleCreateNostrId();
        }}
      >
        Create account
      </Button>
      <Button
        variant='popup'
        visibility={nostrId ? 'visible' : 'hidden'}
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
