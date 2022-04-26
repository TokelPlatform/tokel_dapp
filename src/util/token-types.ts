import BigNumObject from './types/BigNum';

export type ArbitraryTokenData = Record<string, string | number | boolean>;

export interface TokelStandardDataFormat {
  url: string;
  id: number;
  royalty: number;
  arbitrary: string;
  arbitraryAsJson?: ArbitraryTokenData;
}

export interface CreateTokenPayload {
  name: string;
  supply: number;
  description: string;
  tokenData: TokelStandardDataFormat;
}

export interface TokenDetail {
  tokenid: string;
  owner: string;
  name: string;
  supply: number;
  description: string;
  data: string;
  dataAsJson?: TokelStandardDataFormat;
  version: number;
  IsMixed: boolean;
  contentType?: string;
}

export interface OrderDetail {
  orderid: string;
  bnAmount: BigNumObject;
  type: 'bid' | 'ask';
  bnUnitPrice: BigNumObject;
  token: TokenDetail;
  originPk: string;
  originNormalAddress: string;
}

export interface OrderDetailLite {
  ExpiryHeight: number;
  bidamount?: number;
  askamount?: number;
  funcid: string;
  origaddress: string;
  origtokenaddress: string;
  price: number;
  tokenid: string;
  totalrequired: number;
  txid: string;
}

export interface TokenForm {
  name: string;
  description: string;
  supply: number | string;
  url?: string;
  royalty?: number;
  id?: number;
  confirmation?: boolean;
  arbitraryAsJson?: Record<string, unknown>;
  arbitraryAsJsonUnformatted?: Array<{ key: string; value: string }>;
}
