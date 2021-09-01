export const messageTypes = {
  newaddress: 'getNewAddress',
  login: 'login',
  listUnspent: 'listUnspent',
  listtransactions: 'listtransactions',
  spend: 'spend',
};

const message = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const GET_NEW_ADDRESS = () => message(messageTypes.newaddress, null);

export const LOGIN = key => message(messageTypes.login, key);

export const LIST_UNSPENT = address => message(messageTypes.listUnspent, address);

export const LIST_TXS = address => message(messageTypes.listtransactions, address);

export const SPEND = (address, amount) => message(messageTypes.spend, { address, amount });

export const hello = 'hello';
