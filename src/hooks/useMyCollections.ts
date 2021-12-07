import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { selectAccountPubKey, selectTokenDetails } from 'store/selectors';

const useMyCollections = () => {
  const tokenDetails = useSelector(selectTokenDetails);
  const myPubKey = useSelector(selectAccountPubKey);

  const myCollections = useMemo(() => {
    const collections = Object.values(tokenDetails)
      .filter(
        ({ owner, supply, dataAsJson }) =>
          owner === myPubKey &&
          supply === 1 &&
          Boolean(dataAsJson?.id) &&
          Boolean(dataAsJson?.arbitraryAsJson?.collection_name)
      )
      .map(({ dataAsJson }) => ({
        label: dataAsJson.arbitraryAsJson.collection_name as string,
        value: dataAsJson.id,
      }));

    const allIds = collections.map(({ value }) => value);
    const filteredCollections = collections
      .filter(({ value }, index) => allIds.indexOf(value) === index)
      .sort((a, b) => a.label.localeCompare(b.label));

    return filteredCollections;
  }, [tokenDetails, myPubKey]);

  return myCollections;
};

export default useMyCollections;
