import browser, { Tabs } from 'webextension-polyfill';
import { ActionResponse, MessageData } from '../types';

export const sendMessage = async <T>(
  data: MessageData<T>
): Promise<ActionResponse> => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs: Tabs.Tab[] = await browser.tabs.query(queryOptions);
  const currentTabId = tabs[0]?.id;

  if (currentTabId !== undefined) {
    return browser.tabs.sendMessage(currentTabId, data);
  }

  return {
    success: false,
    error: 'Failed to send message. Unknown tab id',
  } as ActionResponse;
};
