import { LoginType } from './defines';

export type ILoginType = typeof LoginType[keyof typeof LoginType];

export interface IWallet {
  name: string;
  filename: string;
}
