import { CreateTokenPayload, TokenForm } from './token-types';

const formatTokenFormIntoStandard = (token: TokenForm): CreateTokenPayload => {
  Object.keys(token.arbitraryAsJson).forEach(key => {
    if (!token.arbitraryAsJson[key]) delete token.arbitraryAsJson[key];
  });

  const arbitrary = token.arbitraryAsJsonUnformatted.reduce(
    (arb, { key, value }) => ({ ...arb, [key]: value }),
    // Make sure our own arbitrary information takes precedence over any other arbitrary key defined by user
    token.arbitraryAsJson
  );

  const parsedSupply = parseInt(`${token.supply}`.replace(/\D/g, ''), 10);
  const hexArbitrary =
    Boolean(arbitrary) && Object.keys(arbitrary).length > 0
      ? Buffer.from(JSON.stringify(arbitrary)).toString('hex')
      : undefined;

  return {
    name: token.name,
    supply: parsedSupply,
    description: token.description,
    tokenData: {
      url: token.url,
      id: token.id,
      royalty: token.royalty * 10,
      arbitrary: hexArbitrary,
    },
  };
};

export default formatTokenFormIntoStandard;
