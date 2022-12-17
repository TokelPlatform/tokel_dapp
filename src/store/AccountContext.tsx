import React from 'react';

export const AccountContext = React.createContext(null);
type AccountContextProps = {
  children: React.ReactElement;
};

const AccountContextProvider = ({ children }: AccountContextProps) => {
  const [state, setState] = React.useState({
    address: null,
  });

  return (
    <AccountContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextProvider;
