import React from 'react';
import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react';

import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { useSidebar } from '../context/context';
import { theme } from '../theme';
import { openSidebar } from '../utils/Event';
import { Highlights } from './Highlights';

export function Popup() {
  const { toggleSidebar } = useSidebar();
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
      </Flex>
      <Box>
        <Heading as='h5' fontWeight='500' m={0} mb='12px'>
          Your Highlights
        </Heading>
        <Highlights />
      </Box>
      <Button
        variant='popup'
        onClick={() => {
          openSidebar();
          toggleSidebar();
        }}
      >
        Open sidebar to see your highlights
      </Button>
    </Flex>
  );
}
