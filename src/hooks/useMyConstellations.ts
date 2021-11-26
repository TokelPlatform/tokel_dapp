import { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { selectAccountPubKey, selectTokenDetails } from 'store/selectors';

const useMyConstellations = () => {
  const tokenDetails = useSelector(selectTokenDetails);
  const myPubKey = useSelector(selectAccountPubKey);

  const myConstellations = useMemo(() => {
    const myNFTs = Object.values(tokenDetails).filter(
      ({ owner, supply, dataAsJson }) =>
        owner === myPubKey &&
        supply === 1 &&
        !!dataAsJson?.id &&
        !!dataAsJson?.arbitraryAsJson?.constellation_name
    );

    const filteredConstellations = [];

    myNFTs.forEach(({ dataAsJson }) => {
      if (!filteredConstellations.map(({ value }) => value).includes(dataAsJson.id)) {
        filteredConstellations.push({
          label: dataAsJson.arbitraryAsJson.constellation_name,
          value: dataAsJson.id,
        });
      }
    });

    return filteredConstellations;
  }, [tokenDetails, myPubKey]);

  return myConstellations;
};

export default useMyConstellations;
