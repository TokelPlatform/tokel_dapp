import { ipcRenderer } from 'electron';

import { BITGO_IPC_ID, NetworkType } from '../vars/defines';

export enum BitgoAction {
  SET_NETWORK = 'set_network',
  RECONNECT = 'reconnect',
  NEW_ADDRESS = 'new_address',
  LOGIN = 'login',
  LOGOUT = 'logout',
  LIST_UNSPENT = 'list_unspent',
  LIST_TRANSACTIONS = 'list_transactions',
  SPEND = 'spend',
  BROADCAST = 'broadcast',
  TOKEN_V2_ADDRESS = 'token_v2_address',
  TOKEN_V2_INFO_TOKEL = 'token_v2_info_tokel',
  TOKEN_V2_TRANSFER = 'token_v2_transfer',
}

export type MsgType = typeof BitgoAction;
export type MsgName = keyof MsgType;
export type MsgValue = MsgType[MsgName];

export type BitgoMessageParamList = {
  [BitgoAction.SET_NETWORK]: { network: NetworkType; overrides: Record<string, unknown> };
  [BitgoAction.RECONNECT]: undefined;
  [BitgoAction.NEW_ADDRESS]: undefined;
  [BitgoAction.LOGIN]: { key: string };
  [BitgoAction.LOGOUT]: undefined;
  [BitgoAction.LIST_UNSPENT]: { address: string };
  [BitgoAction.LIST_TRANSACTIONS]: { address: string; skipCount?: number };
  [BitgoAction.SPEND]: { address: string; amount: number };
  [BitgoAction.BROADCAST]: { txHex: string };
  [BitgoAction.TOKEN_V2_ADDRESS]: undefined;
  [BitgoAction.TOKEN_V2_INFO_TOKEL]: { tokenId: string };
  [BitgoAction.TOKEN_V2_TRANSFER]: { destpubkey: string; tokenid: string; amount: number };
};

type ConditionalOptions<T, K extends keyof T> = T[K] extends undefined ? [] : [T[K]];

export function sendToBitgo<T extends MsgValue>(
  type: T,
  ...options: ConditionalOptions<BitgoMessageParamList, T>
): void {
  ipcRenderer.send(BITGO_IPC_ID, { type, payload: options[0] });
}

type BitgoMsg = {
  type: BitgoAction;
  payload: any;
};

export const checkData = (msg: BitgoMsg) => {
  if (msg.type === BitgoAction.LOGIN) {
    return {
      type: msg.type,
    };
  }
  return msg;
};
