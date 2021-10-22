// nspv settings
// export const TICKER = 'TKLTEST';
// export const RPC_PORT = '22025';
export const TICKER = 'TKL';
export const RPC_PORT = '29405';
export const BITGO_IPC_ID = 'bitgo';

export const TOKEL_PRICE_URL = 'https://api.coinpaprika.com/v1/tickers/tkl-tokel';
export const TOKEL_PRICE_UPDATE_PERIOD_MS = 10_000;

export const TOPBAR_HEIGHT = 38;
export const FEE = 0.0001;
export const FIAT_CURRENCY = 'USD';
export const USD_VALUE = 5;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';

export const TokenFilter = {
  ALL: 'ALL',
  NFT: 'NFTS',
  FIXED_SUPPLY: 'FIXED SUPPLY',
};

export enum ResourceType {
  TOKEL = 'tkl',
  NFT = 'nft',
  FST = 'tokens',
}

export const WindowSize = {
  XL: 1440,
  L: 1024,
  M: 760,
  S: 420,
};

export const WindowControl = {
  CLOSE: 'close',
  MIN: 'minimize',
  MAX: 'maximize',
};

export enum ViewType {
  DASHBOARD = 'dashboard',
  DEX = 'dex',
  NFT_MARKET = 'nft_market',
  SETTINGS = 'settings',
}

export enum ModalName {
  RECEIVE = 'receive',
  SEND = 'send',
  FEEDBACK = 'feedback',
  TX_DETAIL = 'tx_detail',
}

export const Config = {
  DECIMAL: 8,
  DECIMAL_FIAT: 6,
};

export const Colors = {
  WHITE: 'white',
  GRAY: 'gray',
  BLACK: 'black',
  PURPLE: 'purple',
  TRANSPARENT: 'transparent',
};

export const OsType = {
  LINUX: 'Linux',
  MAC: 'Darwin',
  WINDOWS: 'Windows_NT',
};

export const SEE_EXPLORER = 'See explorer link for details';

export const INFORMATION_N_A = 'This information is currently not available';

export const NspvErrors = {
  INVALID_ADDR_AMOUNT_SMALL: 'invalid address or amount too small',
};

export const ErrorMessages = {
  ENTER_WIF: 'Please enter WIF',
  NETWORK_ISSUES: 'You are experiencing network issues. Please restart the app and try again',
  INVALID_ADDRESS: 'Entered address is not valid. Please check it and try again',
};
