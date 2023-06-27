import React, { useEffect, useState } from 'react';

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
  Text,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useSettings } from '../../context/settingsContext';

export function Account() {
  const { settings } = useSettings();

  const [nostrId, setNostrId] = useState<{
    privkey: string;
    pubkey: string;
  } | null>(null);
  const [relays, setRelays] = useState<string[]>([]);

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

    settings
      .getRelays()
      .then((relays) => {
        setRelays(relays);
      })
      .catch((err) => {
        // Show error message
        console.log(err);
      });
  }, [settings]);
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
              <Td width='100%' py='20px' minWidth={''}>
                <Text
                  width={'100%'}
                  textAlign={'left'}
                  fontWeight={500}
                  fontSize={16}
                >
                  {nostrId?.pubkey}
                </Text>
              </Td>
              {nostrId && (
                <Td py='20px'>
                  <IconButton
                    aria-label='Copy'
                    icon={<CopyIcon />}
                    color='primary'
                    variant='ghost'
                    onClick={() => {
                      copyToClipboard(nostrId.pubkey);
                    }}
                  />
                </Td>
              )}
            </Tr>
            <Tr display='flex'justifyContent='center'>
              <Td py='20px'>Private key</Td>
              <Td width={'100%'} minWidth='' py='20px'>
                <Text
                  width={'100%'}
                  textAlign={'left'}
                  fontWeight={500}
                  fontSize={20}
                >
                  ************
                </Text>
              </Td>
              {nostrId && (
                <Td py='20px'>
                  <IconButton
                    aria-label='Copy'
                    padding={"0px"}
                    icon={<CopyIcon />}
                    color='primary'
                    variant='ghost'
                    onClick={() => {
                      copyToClipboard(nostrId.privkey);
                    }}
                  />
                </Td>
              )}
            </Tr>
            <Tr
              display={'flex'}
              alignItems={'center'}
              justifyContent={'stretch'}
              columnGap={'36px'}
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
