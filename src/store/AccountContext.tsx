import React, { createContext, ReactElement, useState } from 'react';

export const AccountContext = createContext(null);
type AccountContextProps = {
  children: ReactElement;
};

const AccountContextProvider = ({ children }: AccountContextProps) => {
  const [state, setState] = useState({
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
