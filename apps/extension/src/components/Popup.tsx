import React from 'react';
import styled from 'styled-components';

import { Button } from '@chakra-ui/react';

import Colighter from '../assets/colighter.svg';
import Gear from '../assets/gear.svg';
import { useSidebar } from '../context/context';
import { openSidebar } from '../utils/Event';
import { Highlights } from './Highlights';

const Container = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  border: ${({ theme }) => `1px solid ${theme.palette.lightGray}`};
  border-radius: 12px;
  width: 400px;
  gap: 30px;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Heading = styled.h5`
  font-weight: 500;
  margin: 0;
  margin-bottom: 12px;
`;

export function Popup() {
  const { toggleSidebar } = useSidebar();
  return (
    <Container>
      <Row>
        <img src={`${Colighter}`} alt='colighter-logo' />
        <img src={`${Gear}`} alt='gear-icon' />
      </Row>
      <div>
        <Heading>Your Highlights</Heading>
        <Highlights />
      </div>
      <Button
        variant='popup'
        onClick={() => {
          openSidebar();
          toggleSidebar();
        }}
      >
        Open sidebar to see your highlights
      </Button>
    </Container>
  );
}
