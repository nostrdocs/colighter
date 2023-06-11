import React, { useEffect } from 'react';

import {
  Button,
  Flex,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { tryReadLocalStorage, tryWriteLocalStorage } from '../../utils/Storage';

const firstKeys = ['Ctrl', 'Alt', 'Shift'];

export function General() {
  const toast = useToast();
  const [shortcut, setShortcut] = React.useState({
    firstKey: firstKeys[0],
    secondKey: 'H',
  });
  const [variant, setVariant] = React.useState<'stoneGrey' | 'halfPrimary'>(
    'stoneGrey'
  );

  useEffect(() => {
    tryReadLocalStorage<string>('shortcutKey').then(
      (result: string | undefined) => {
        setShortcut({
          firstKey: result?.split('+')[0] || '',
          secondKey: result?.split('+')[1] || '',
        });
      }
    );
  }, []);

  const handleShortcutChange = (value: string) => {
    setShortcut({
      ...shortcut,
      secondKey: value,
    });
  };

  const handleSave = async () => {
    if (!shortcut.firstKey || !shortcut.secondKey) {
      toast({
        position: 'bottom',
        render: () => (
          <Flex
            justifyContent='center'
            alignItems='center'
            color='white'
            p='3'
            margin={4}
            bg='primary'
          >
            Please set a shortcut before saving!
          </Flex>
        ),
      });
      return;
    }
    await tryWriteLocalStorage(
      'shortcutKey',
      `${shortcut.firstKey}+${shortcut.secondKey.toUpperCase()}`
    );
    toast({
      position: 'bottom',
      render: () => (
        <Flex
          justifyContent='center'
          alignItems='center'
          color='white'
          p='3'
          margin={4}
          bg='primary'
        >
          Shortcut saved!
        </Flex>
      ),
    });
  };

  return (
    <Flex flexDirection={'column'} py={5} px={5}>
      <Text color={'secondary'} fontSize={16} fontWeight={600}>
        Customize Highlight shortcut
      </Text>
      <Flex maxWidth={350} flexDirection={'column'}>
        <Flex color={'secondary'} gap={10} mt={10}>
          <HStack spacing={10}>
            <VStack spacing={5}>
              {firstKeys.map((key) => (
                <Button
                  key={key}
                  onClick={() => {
                    setShortcut({
                      ...shortcut,
                      firstKey: key,
                    });
                  }}
                  variant={key === shortcut.firstKey ? variant : 'stoneGrey'}
                  onFocus={() => {
                    setVariant('halfPrimary');
                  }}
                  fontSize={16}
                  fontWeight={500}
                  w={100}
                  padding={7}
                >
                  {key}
                </Button>
              ))}
            </VStack>
            <Text fontSize={16}>+</Text>
            <PinInput
              type='alphanumeric'
              value={shortcut.secondKey.toUpperCase()}
              onChange={(value) => handleShortcutChange(value)}
              size='lg'
              variant='filled'
              placeholder='H'
            >
              <PinInputField
                color={'secondary'}
                fontSize={16}
                fontWeight={600}
                _focus={{
                  color: 'secondary',
                }}
              />
            </PinInput>
          </HStack>
        </Flex>
        <Button
          onClick={handleSave}
          variant={'halfPrimary'}
          fontSize={16}
          fontWeight={500}
          mt={10}
          w={100}
          alignSelf={'flex-end'}
          padding={7}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
}
