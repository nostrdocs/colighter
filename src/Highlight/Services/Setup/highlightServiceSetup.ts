import browser from 'webextension-polyfill';
import { sendMessage } from '../Message/sendMessageService';

function setupHighlighting() {
  let highlightStatus = false;
  const toggleHighlightBtn = document.getElementById(
    'toggle-highlight',
  ) as HTMLInputElement;

  // Load value from local storage
  browser.storage.local.get().then((store) => {
    highlightStatus = store.highlight_status || false;

    sendMessage({
      action: 'TOGGLE_HIGHLIGHT',
      data: { highlightStatus: highlightStatus },
    });
    toggleHighlightBtn.checked = highlightStatus;
  });

  // Enable/Disable highlighting on toggle button click
  toggleHighlightBtn.addEventListener('click', () => {
    highlightStatus = !highlightStatus;
    browser.storage.local.set({ highlight_status: highlightStatus });

    sendMessage({
      action: 'TOGGLE_HIGHLIGHT',
      data: { highlightStatus: highlightStatus },
    });
  });
}

export { setupHighlighting };
