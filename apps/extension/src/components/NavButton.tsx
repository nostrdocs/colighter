import React from 'react';

import { Button } from '@chakra-ui/react';
import { SettingsSelection } from '../screens/types';
import { tryWriteLocalStorage } from '../utils/Storage';

export const NavButton = ({
  text,
  selection,
  currentSelection,
  onSelect,
}: {
  text: string;
  selection: SettingsSelection;
  currentSelection: SettingsSelection;
  onSelect: (selection: SettingsSelection) => void;
}) => {
  const isSelected = currentSelection === selection;
  const variant = isSelected ? 'halfPrimary' : 'stoneGrey';

  const select = async () => {
    await tryWriteLocalStorage<SettingsSelection>(
      'settingsSelection',
      selection
    );
    onSelect(selection);
  };

  return (
    <Button
      onClick={select}
      variant={variant}
      width='100%'
      padding='20px'
      fontSize={18}
      fontWeight={isSelected ? 'bold' : 'normal'}
      _focus={{ outline: 'none' }}
    >
      {text}
    </Button>
  );
};
