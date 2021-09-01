export const messageTypes = {
  newaddress: 'getNewAddress',
  login: 'login',
  listUnspent: 'listUnspent',
  listtransactions: 'listtransactions',
};

const message = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const GET_NEW_ADDRESS = () => message('getNewAddress', null);

export const LOGIN = key => message('login', key);

export const LIST_UNSPENT = address => message(messageTypes.listUnspent, address);

export const LIST_TXS = address => message(messageTypes.listtransactions, address);

export const hello = 'hello';
