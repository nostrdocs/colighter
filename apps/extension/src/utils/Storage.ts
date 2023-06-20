import browser from 'webextension-polyfill';

export const tryReadLocalStorage = async <T>(
  key: string
): Promise<T | undefined> => {
  const storage = await browser.storage.local.get();
  return storage[key];
};

export const tryWriteLocalStorage = async <T>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value });
};
