import React, { useEffect, useState } from 'react';

import {
  Container,
  Flex,
  Grid,
  GridItem,
  useColorMode,
  VStack,
} from '@chakra-ui/react';

import { NavButton } from '../components/NavButton';
import { Account } from '../components/Settings/Account';
import { General } from '../components/Settings/General';
import { tryReadLocalStorage } from '../utils/Storage';
import { SettingsSelection, SettingsSelectionType } from './types';

export function Settings() {
  const { colorMode } = useColorMode();
  const [currentSelection, setCurrentSelection] = useState<SettingsSelection>(
    SettingsSelectionType.GENERAL
  );

  useEffect(() => {
    const loadPersistedSelection = async () => {
      const persistedSelection = await tryReadLocalStorage<SettingsSelection>(
        'settingsSelection'
      );

      if (persistedSelection) {
        setCurrentSelection(persistedSelection);
      }
    };

    loadPersistedSelection();
  }, []);

  return (
    <Container maxWidth='1240px' mt='10' py='10'>
      <Grid
        templateAreas={`
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={'50px 1fr'}
        gridTemplateColumns={'20% 1fr'}
        h='100%'
        gap='10'
        color='blackAlpha.700'
        fontWeight='bold'
      >
        <GridItem pl='2' area={'nav'}>
          <VStack
            spacing={10}
            justifyContent='flex-start'
            alignItems='flex-start'
          >
            <NavButton
              text='General'
              selection={SettingsSelectionType.GENERAL}
              currentSelection={currentSelection}
              onSelect={setCurrentSelection}
            />
            <NavButton
              text='Account'
              selection={SettingsSelectionType.ACCOUNT}
              currentSelection={currentSelection}
              onSelect={setCurrentSelection}
            />
            <NavButton
              text='Notifications'
              selection={SettingsSelectionType.NOTIFICATIONS}
              currentSelection={currentSelection}
              onSelect={setCurrentSelection}
            />
          </VStack>
        </GridItem>
        <GridItem
          bg={colorMode === 'dark' ? 'textLight' : 'secondary'}
          pl='2'
          area={'main'}
          borderRadius={10}
          height={`calc(100vh - 100px)`}
          overflow={'auto'}
        >
          {currentSelection === SettingsSelectionType.GENERAL && (
            <Flex flexDirection='column' h='100%'>
              <General />
            </Flex>
          )}
          {currentSelection === SettingsSelectionType.ACCOUNT && <Account />}
          {currentSelection === SettingsSelectionType.NOTIFICATIONS && (
            <Flex flexDirection='column' h='100%'>
              Coming Soon!
            </Flex>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}
