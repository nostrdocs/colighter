import browser from 'webextension-polyfill';
import { StorageKey } from '../types';

export const tryReadLocalStorage = async <T>(
  key: string
): Promise<T | undefined> => {
  const storage = await browser.storage.local.get();
  return storage[key];
};

export const readLocalStorage = async <T>(
  key: StorageKey
): Promise<T | undefined> => {
  return tryReadLocalStorage<T>(key);
};

export const tryWriteLocalStorage = async <T>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value });
};

export const writeLocalStorage = async <T>(key: StorageKey, value: T) => {
  return tryWriteLocalStorage<T>(key, value);
};
