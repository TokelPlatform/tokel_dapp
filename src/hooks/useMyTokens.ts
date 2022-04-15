import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import BN from 'bn.js';

import { selectTokenBalances, selectTokenDetails } from 'store/selectors';
import { parseBigNumObject } from 'util/helpers';

import { SelectOption } from 'components/_General/_FormikElements/Select';

type Tokens = Record<string, SelectOption>;

const useMyTokens = (): Tokens => {
  const tokenDetails = useSelector(selectTokenDetails);
  const tokenBalances = useSelector(selectTokenBalances);

  const tokensMap = useMemo(
    () =>
      Object.values(tokenDetails).reduce((tokens, { name, tokenid }) => {
        let bnBalance = parseBigNumObject(tokenBalances[tokenid]);
        if (bnBalance.gt(new BN(0)))
          return {
            ...tokens,
            [tokenid]: {
              label: `${name} (${bnBalance.toString()} in wallet)`,
              value: tokenid,
            },
          };

        return tokens;
      }, {}),
    [tokenDetails]
  );

  return tokensMap;
};

export default useMyTokens;
