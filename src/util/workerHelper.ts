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

export const getNewAddress = () => message(messageTypes.newaddress, null);

export const login = key => message(messageTypes.login, key);

export const listUnspent = address => message(messageTypes.listUnspent, address);

export const listTxs = address => message(messageTypes.listtransactions, address);

export const spend = (address, amount) => message(messageTypes.spend, { address, amount });
