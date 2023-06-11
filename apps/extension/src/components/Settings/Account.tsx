import React from 'react';

import { CheckCircleIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Flex,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  useToast,
} from '@chakra-ui/react';

const relays = [
  'wss://eden.nostr.land',
  'wss://nostr.milou.lol',
  'wss://puravida.nostr.land',
  'wss://relay.nostr.com.au',
];

type AccountProps = {
  pub_key: string;
  priv_key: string;
};

export function Account({ pub_key, priv_key }: AccountProps) {
  const toast = useToast();
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      position: 'bottom',
      render: () => (
        <Flex
          justifyContent='center'
          alignItems='center'
          color='white'
          p='3'
          bg='primary'
        >
          Copied to clipboard!
        </Flex>
      ),
    });
  }

  return (
    <Flex
      flexDirection='column'
      h='100%'
      justifyContent='flex-start'
      alignItems='flex-start'
    >
      <TableContainer>
        <Table variant='simple' color='secondary'>
          <Tbody>
            <Tr display='flex' alignItems='center' justifyContent='center'>
              <Td py='20px'>Public key</Td>
              <Td
                width='100%'
                minWidth='520px'
                py='20px'
                textAlign='center'
                fontWeight={500}
                fontSize={16}
              >
                {pub_key}
              </Td>
              <IconButton
                aria-label='Copy'
                icon={<CopyIcon />}
                color='primary'
                size='200px'
                width={'100%'}
                variant='ghost'
                onClick={() => {
                  copyToClipboard(pub_key);
                }}
              />
            </Tr>
            <Tr display='flex' alignItems='center' justifyContent='center'>
              <Td py='20px'>Private key</Td>
              <Td
                width={'100%'}
                minWidth='520px'
                py='20px'
                textAlign='center'
                fontWeight={500}
                fontSize={30}
              >
                ************
              </Td>
              <IconButton
                aria-label='Copy'
                icon={<CopyIcon />}
                size='200px'
                width='100%'
                color='primary'
                variant='ghost'
                onClick={() => {
                  copyToClipboard(priv_key);
                }}
              />
            </Tr>
            <Tr
              display={'flex'}
              alignItems={'center'}
              justifyContent={'stretch'}
              columnGap={'40px'}
            >
              <Td py='20px' borderBottom={0}>
                Relays
              </Td>
              <Td py='20px' borderBottom={0} fontSize={16}>
                <List spacing={3}>
                  {relays.map((relay) => (
                    <ListItem key={relay} fontWeight={500} color='secondary'>
                      <ListIcon as={CheckCircleIcon} color='primary' />
                      {relay}
                    </ListItem>
                  ))}
                </List>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
