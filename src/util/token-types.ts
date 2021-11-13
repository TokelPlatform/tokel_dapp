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
