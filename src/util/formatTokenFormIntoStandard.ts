import { TokenForm } from './token-types';

const formatTokenFormIntoStandard = (
  token: TokenForm
): {
  name: string;
  supply: number;
  description: string;
  tokenData: Record<string, unknown>;
} => {
  let arbitrary = {};

  token.arbitraryAsJsonUnformatted.forEach(({ key, value }) => {
    arbitrary[key] = value;
  });

  // Make sure our own arbitrary information takes precedence over any other arbitrary key defined by user
  arbitrary = { ...arbitrary, ...token.arbitraryAsJson };

  const parsedSupply = parseInt(`${token.supply}`.replace(/\D/g, ''), 10);
  const hexArbitrary = Buffer.from(JSON.stringify(arbitrary)).toString('hex');

  const compliantToken = {
    name: token.name,
    supply: parsedSupply,
    description: token.description,
    tokenData: {
      url: token.url,
      id: parseInt(token.id, 10),
      royalty: token.royalty * 10,
      arbitrary: hexArbitrary,
    },
  };

  return compliantToken;
};

export default formatTokenFormIntoStandard;
