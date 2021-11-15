export type TokelStandardDataFormat = {
  url: string;
  id: number;
  royalty: number;
  arbitrary: string;
  arbitraryAsJson?: Record<string, unknown>;
};

export type TokenDetail = {
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
};

export type TokenForm = {
  name: string;
  description: string;
  supply: number | string;
  url?: string;
  royalty?: number;
  id?: string;
  arbitraryAsJson?: Record<string, unknown>;
  arbitraryAsJsonUnformatted?: Array<{ key: string; value: string }>;
};
