// import keytar from 'keytar';

// import { IEncKey, deriveKey, getCredentials } from './core';

// const KEYCHAIN_SERVICE = 'TokelDapp';

// // keytar implementation
// export const getKeyFromStoredPassword = async (walletName: string): Promise<IEncKey | null> => {
//   const password = await keytar.getPassword(KEYCHAIN_SERVICE, walletName);
//   if (!password) return null;
//   const creds = await getCredentials(walletName);
//   if (!creds) return null;
//   const encKey = await deriveKey(password, creds.salt);
//   return encKey;
// };

// export const savePasswordToKeychain = async (
//   walletName: string,
//   password: string
// ): Promise<void> => {
//   await keytar.setPassword(KEYCHAIN_SERVICE, walletName, password);
// };
