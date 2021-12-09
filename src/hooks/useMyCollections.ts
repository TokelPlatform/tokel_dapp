import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountPubKey, selectTokenDetails } from 'store/selectors';

type Collections = Record<string, { label: string; value: number }>;

const useMyCollections = (): Collections => {
  const tokenDetails = useSelector(selectTokenDetails);
  const myPubKey = useSelector(selectAccountPubKey);

  const collectionsMap = useMemo(
    () =>
      Object.values(tokenDetails).reduce((collections, { owner, supply, dataAsJson }) => {
        if (
          owner === myPubKey &&
          supply === 1 &&
          Boolean(dataAsJson?.id) &&
          Boolean(dataAsJson?.arbitraryAsJson?.collection_name)
        ) {
          return {
            ...collections,
            [dataAsJson.id]: {
              label: dataAsJson.arbitraryAsJson.collection_name,
              value: dataAsJson.id,
            },
          };
        }
        return collections;
      }, {}),
    [tokenDetails, myPubKey]
  );

  return collectionsMap;
};

export default useMyCollections;
