import React from 'react';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';

import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { useSidebar } from '../context/sidebarContext';
import { Highlights } from './Highlights';
import { theme } from '../theme';
import { openExtensionSettings } from '../utils/Event';

const defaultSelection = {
  ALL_HIGHLIGHTS: true,
  MY_HIGHLIGHTS: false,
};

export function Sidebar() {
  const { isOpen, closeIframeSidebar } = useSidebar();
  const [selected, setSelected] =
    React.useState<typeof defaultSelection>(defaultSelection);

  const handleSelection = (selection: boolean) => {
    setSelected({
      ALL_HIGHLIGHTS: !selection,
      MY_HIGHLIGHTS: selection,
    });
  };

  const allHighlightVariant = selected.ALL_HIGHLIGHTS
    ? 'halfPrimary'
    : 'stoneGrey';
  const myHighlightVariant = selected.MY_HIGHLIGHTS
    ? 'halfPrimary'
    : 'stoneGrey';

  const btnRef = React.useRef(null);
  return (
    <>
      <Drawer
        size={'sm'}
        isOpen={isOpen}
        placement='right'
        onClose={closeIframeSidebar}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Image src={`${Colighter}`} alt='colighter-logo' />
            <Image
              cursor='pointer'
              onClick={openExtensionSettings}
              src={`${Gear}`}
              alt='settings-icon'
            />
          </DrawerHeader>

          <DrawerBody>
            <Flex>
              <Button
                borderRadius='77px 0px 0px 77px'
                variant={myHighlightVariant}
                onClick={() => handleSelection(defaultSelection.ALL_HIGHLIGHTS)}
              >
                My highlights
              </Button>
              <Button
                borderRadius='0px 77px 77px 0px'
                variant={allHighlightVariant}
                onClick={() => handleSelection(defaultSelection.MY_HIGHLIGHTS)}
              >
                All highlights
              </Button>
            </Flex>
            <Box mt={4}>
              <Text fontSize='24px' fontWeight='500' lineHeight='30px'>
                {selected.ALL_HIGHLIGHTS ? 'All highlights' : 'My highlights'}
              </Text>
              <Box
                mt={2}
                mb={4}
                width='100%'
                height='1px'
                bg={`${theme.palette.lightGray}}`}
              ></Box>

              {selected.ALL_HIGHLIGHTS?
                <Highlights />:
                <Highlights myHighlights />
              }
            
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant={'primary'} mr={3} onClick={closeIframeSidebar}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
