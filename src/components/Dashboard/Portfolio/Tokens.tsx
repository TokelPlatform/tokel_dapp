import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import Fuse from 'fuse.js';

import { ReactComponent as SearchIcon } from 'assets/Search.svg';
import { dispatch } from 'store/rematch';
import {
  selectChosenToken,
  selectMyTokenDetails,
  selectTokenFilterId,
  selectTokenSearchTerm,
} from 'store/selectors';
import { V } from 'util/theming';
import { TokenDetail } from 'util/token-types';
import { ModalName, PORTFOLIO_ITEM_HEIGHT_PX, ResourceType, TokenFilter } from 'vars/defines';

import PortfolioItem from './PortfolioItem';

const FilterFunc = {
  [TokenFilter.ALL]: () => true,
  [TokenFilter.NFT]: (token: TokenDetail) => token.supply === 1,
  [TokenFilter.FIXED_SUPPLY]: (token: TokenDetail) => token.supply !== 1,
};

const TokensRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: calc(100% - ${PORTFOLIO_ITEM_HEIGHT_PX}px);
`;

const TokenTypeFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 14px;
  border-top: 2px solid ${V.color.backSofter};
  border-bottom: 2px solid ${V.color.backSofter};
`;

const TokenFilterItem = styled.span<{ active: boolean }>`
  font-size: ${V.font.pSmall};
  cursor: pointer;
  color: ${({ active }) => (active ? V.color.frontSofter : V.color.frontSoft)};
`;

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const TokenSearchBar = styled.div`
  padding: 1.4rem;
  border-top: 1px solid ${V.color.backSofter};
`;

const TokenSearchInputContainer = styled.div`
  display: flex;
  background-color: ${V.color.backHard};
  border: 1px solid ${V.color.backSofter};
  border-radius: ${V.size.borderRadius};
  overflow: hidden;
  &:focus-within {
    border-color: ${V.color.cornflower};
  }
`;

const TokenSearchInput = styled.input`
  flex-grow: 1;
  padding: 0.6rem;
  padding-right: 0;
  font-size: ${V.font.p};
  background: none;
  color: ${V.color.frontSoft};
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  background: none;
  border: none;
  padding: 0 12px;
  align-items: center;
  justify-content: center;
`;

const fuseOptions = {
  keys: ['tokenid', 'name', 'description'],
};

const Tokens = () => {
  const chosenToken = useSelector(selectChosenToken);

  const tokenFilterId = useSelector(selectTokenFilterId);
  const tokenSearchTerm = useSelector(selectTokenSearchTerm);
  const tokenDetails = useSelector(selectMyTokenDetails);

  const filteredTokenDetails = React.useMemo(() => {
    let result = Object.values(tokenDetails ?? []);
    const filterFunc = FilterFunc[tokenFilterId];
    if (filterFunc) {
      result = result.filter(filterFunc);
    }
    if (tokenSearchTerm === '' || !result.length) {
      return result;
    }
    const fuse = new Fuse(result, fuseOptions);
    return fuse.search(tokenSearchTerm).map(res => res.item);
  }, [tokenFilterId, tokenSearchTerm, tokenDetails]);

  return (
    <TokensRoot>
      <TokenTypeFilterBar>
        {Object.values(TokenFilter).map(filterId => (
          <TokenFilterItem
            key={filterId}
            onClick={() => dispatch.wallet.SET_TOKEN_FILTER_ID(filterId)}
            active={filterId === tokenFilterId}
          >
            {filterId}
          </TokenFilterItem>
        ))}
      </TokenTypeFilterBar>
      <TokenList>
        {filteredTokenDetails.length ? (
          filteredTokenDetails.map(token => (
            <PortfolioItem
              key={token.tokenid}
              name={`${token.name}`}
              nft={token.supply === 1}
              selected={token.tokenid === chosenToken}
              onClick={() => dispatch.wallet.SET_CHOSEN_TOKEN(token.tokenid)}
            />
          ))
        ) : (
          <PortfolioItem
            name="No tokens yet"
            subtitle="Click here to see your wallet's token address (pubkey)"
            onClick={() =>
              dispatch.environment.SET_MODAL({
                name: ModalName.RECEIVE,
                options: { type: ResourceType.NFT },
              })
            }
          />
        )}
      </TokenList>
      <TokenSearchBar>
        <TokenSearchInputContainer>
          <TokenSearchInput
            onChange={e => dispatch.wallet.SET_TOKEN_SEARCH_TERM(e.currentTarget.value)}
            placeholder="Search"
          />
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
        </TokenSearchInputContainer>
      </TokenSearchBar>
    </TokensRoot>
  );
};

export default Tokens;
