import { ipcRenderer } from 'electron';

import { BITGO_IPC_ID, NetworkType } from '../vars/defines';
import { CreateTokenPayload } from './token-types';

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
  TOKEN_V2_CREATE_TOKEL = 'token_v2_create_tokel',
  ASSET_V2_FETCH_ORDER_DECODED = 'asset_v2_fetch_order_decoded',
  ASSET_V2_FILL_ASK = 'asset_v2_fill_ask',
  ASSET_V2_FILL_BID = 'asset_v2_fill_bid',
  ASSET_V2_POST_ASK = 'asset_v2_post_ask',
  ASSET_V2_POST_BID = 'asset_v2_post_bid',
  ASSET_V2_CANCEL_ASK = 'asset_v2_cancel_ask',
  ASSET_V2_CANCEL_BID = 'asset_v2_cancel_bid',
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
  [BitgoAction.SPEND]: { address: string; amount: string };
  [BitgoAction.BROADCAST]: { txHex: string };
  [BitgoAction.TOKEN_V2_ADDRESS]: undefined;
  [BitgoAction.TOKEN_V2_INFO_TOKEL]: { tokenId: string };
  [BitgoAction.TOKEN_V2_TRANSFER]: { destpubkey: string; tokenid: string; amount: number };
  [BitgoAction.TOKEN_V2_CREATE_TOKEL]: CreateTokenPayload;
  [BitgoAction.ASSET_V2_FETCH_ORDER_DECODED]: { orderId: string };
  [BitgoAction.ASSET_V2_FILL_ASK]: {
    orderId: string;
    tokenId: string;
    amount: number;
    unitPrice: number;
  };
  [BitgoAction.ASSET_V2_FILL_BID]: {
    orderId: string;
    tokenId: string;
    amount: number;
    unitPrice: number;
  };
  [BitgoAction.ASSET_V2_POST_ASK]: {
    tokenId: string;
    amount: number;
    unitPrice: number;
  };
  [BitgoAction.ASSET_V2_POST_BID]: {
    tokenId: string;
    amount: number;
    unitPrice: number;
  };
  [BitgoAction.ASSET_V2_CANCEL_ASK]: {
    tokenId: string;
    amount: number;
  };
  [BitgoAction.ASSET_V2_CANCEL_BID]: {
    tokenId: string;
    amount: number;
  };
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
  payload: unknown;
};

export const checkData = (msg: BitgoMsg) => {
  if (msg.type === BitgoAction.LOGIN) {
    return {
      type: msg.type,
    };
  }
  return msg;
};
