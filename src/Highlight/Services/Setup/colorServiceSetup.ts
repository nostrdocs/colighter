import browser from 'webextension-polyfill';
import { ColorDescription } from '../../../Common/Types';
import { sendMessage } from '../Message/sendMessageService';

function setupColorUsage(colorOptions: ColorDescription[]) {
  let selectedColor: string;

  // Load selected color data from local storage
  browser.storage.local.get().then((store) => {
    selectedColor = store.selected_color || colorOptions[0].val;
    const selectedBtn = document.getElementById(
      `${selectedColor}`,
    ) as HTMLInputElement;

    sendMessage({
      action: 'SET_COLOR',
      data: { color: selectedColor },
    });

    if (selectedBtn != null) selectedBtn.checked = true;
  });

  const colorButtonGroup = document.getElementById('color-row');
  const colorButtons = document.querySelectorAll('input[name="color"]');

  if (colorButtonGroup != null) {
    colorButtonGroup.addEventListener('click', () => {
      for (const colorButton of colorButtons as any) {
        if (colorButton.checked) {
          const colorSelection = colorButton.getAttribute('value');
          browser.storage.local.set({
            selected_color: colorSelection,
          });
          sendMessage({
            action: 'SET_COLOR',
            data: { color: colorSelection },
          });
        }
      }
    });
  }
}

export { setupColorUsage };
