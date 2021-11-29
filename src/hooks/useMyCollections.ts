import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { selectAccountPubKey, selectTokenDetails } from 'store/selectors';

const useMyCollections = () => {
  const tokenDetails = useSelector(selectTokenDetails);
  const myPubKey = useSelector(selectAccountPubKey);

  const myCollections = useMemo(() => {
    const myNFTs = Object.values(tokenDetails).filter(
      ({ owner, supply, dataAsJson }) =>
        owner === myPubKey &&
        supply === 1 &&
        !!dataAsJson?.id &&
        !!dataAsJson?.arbitraryAsJson?.collection_name
    );

    const filteredCollections = [];

    myNFTs.forEach(({ dataAsJson }) => {
      if (!filteredCollections.map(({ value }) => value).includes(dataAsJson.id)) {
        filteredCollections.push({
          label: dataAsJson.arbitraryAsJson.collection_name,
          value: dataAsJson.id,
        });
      }
    });

    return filteredCollections;
  }, [tokenDetails, myPubKey]);

  return myCollections;
};

export default useMyCollections;
