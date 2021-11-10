import React, { useState, useMemo } from 'react';

import styled from '@emotion/styled';
import TokenType from 'util/types/TokenType';

import Icon from 'components/_General/_UIElements/Icon';

import infoIcon from 'assets/friendlyWarning.svg';
import nftIcon from 'assets/Star.svg';
import tokenMenuIcon from 'assets/Token.svg';
import tokenIcon from 'assets/Token-alt.svg';

import CreateTokenForm from './Form';

// dashboard root in dashboard.tsx
const Layout = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: ${props => props.theme.color.backHard};
  padding: 18px;
  margin: 0;
`;

const VerticalColumns = styled.div`
  height: 100%;
`;

// widgetcontainer in common.tsx
const Box = styled.div<{ flex?: boolean }>`
  background-color: ${props => props.theme.color.back};
  border: 1px solid ${props => props.theme.color.backSofter};
  border-radius: ${props => props.theme.size.borderRadius};

  ${props =>
    props.flex &&
    `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
  `}

  height: 100%;

  padding: 35px;
`;

const HelperWidget = styled(Box)`
  height: 240px;
  margin-bottom: 18px;

  p {
    flex-grow: 2;
    margin-top: 0;
    color: ${props => props.theme.color.frontSoft};
    align-self: flex-start;
  }

  img {
    margin-right: 10px;
  }

  h2 {
    margin-right: auto;
  }
`;

const TokenTypeWidget = styled(Box)`
  height: calc(100% - 258px);

  & > div {
    cursor: pointer;
    text-align: center;
    width: 100%;
    outline: none;

    .icon {
      margin-left: auto;
      margin-right: auto;
    }

    &:hover,
    &[data-selected='true'] {
      .icon {
        background: var(--gradient-purple-horizontal);
      }

      h2 {
        color: ${props => props.theme.color.front};
      }
    }

    h2 {
      color: ${props => props.theme.color.frontSoft};
      margin-top: 5px;
    }
  }
`;

const FormBox = styled(Box)`
  padding: 18px;
  .no-state {
    text-align: center;

    h2 {
      margin-bottom: 0;
    }

    h3 {
      margin-top: 5px;
      color: ${props => props.theme.color.frontSoft};
    }

    .icon {
      margin-left: auto;
      margin-right: auto;
      background: var(--gradient-purple-horizontal);
    }
  }
`;

const TokenTypeOption: React.FC<{
  action: () => any;
  selected: boolean;
  icon: any;
  title: string;
}> = ({ action, selected, icon, title }) => (
  <div role="button" tabIndex={0} onClick={action} onKeyDown={action} data-selected={selected}>
    <Icon icon={icon} color="frontSoft" className="icon" />
    <h2>{title}</h2>
  </div>
);

const CreateToken: React.FC = () => {
  const [typeSelected, setTypeSelected] = useState<TokenType | null>(null);

  const form = useMemo(() => {
    switch (typeSelected) {
      case TokenType.NFT:
      case TokenType.TOKEN:
        return <CreateTokenForm tokenType={typeSelected} />;
      case null:
      default:
        return (
          <div className="no-state">
            <Icon icon={tokenMenuIcon} color="frontSoft" className="icon" />
            <h2>Let&apos;s create a token!</h2>
            <h3>To get started, first select what kind of token you wish to create</h3>
          </div>
        );
    }
  }, [typeSelected]);

  const helperText = useMemo(() => {
    switch (typeSelected) {
      case TokenType.NFT:
        return (
          <>
            <h2>About NFTs</h2>
            <p>
              After your NFT is created, your wallet will receive the only unit of it. You&apos;ll
              be able to send it to other wallets or list it on the NFT marketplace.
            </p>
          </>
        );
      case TokenType.TOKEN:
        return (
          <>
            <h2>About Tokens</h2>
            <p>
              You can use tokens to represent ownership of a shared asset, equity of a project,
              membership of a community, or just about anything you can think of.
            </p>
          </>
        );
      case null:
      default:
        return (
          <>
            <h2>Not sure what to select?</h2>
            <p>
              To represent full ownership of a single virtual or physical asset, select NFT. For
              other use cases, select token.
            </p>
          </>
        );
    }
  }, [typeSelected]);

  const selectNFT = () => setTypeSelected(TokenType.NFT);
  const selectToken = () => setTypeSelected(TokenType.TOKEN);

  return (
    <Layout>
      <div style={{ width: '30%', marginRight: '18px' }}>
        <VerticalColumns>
          <HelperWidget flex>
            <img alt="info" src={infoIcon} />
            {helperText}
          </HelperWidget>
          <TokenTypeWidget flex>
            <TokenTypeOption
              action={selectNFT}
              selected={typeSelected === TokenType.NFT}
              title="NFT"
              icon={nftIcon}
            />
            <TokenTypeOption
              action={selectToken}
              selected={typeSelected === TokenType.TOKEN}
              title="Token"
              icon={tokenIcon}
            />
          </TokenTypeWidget>
        </VerticalColumns>
      </div>
      <div style={{ width: '70%' }}>
        <FormBox flex={typeSelected === null}>{form}</FormBox>
      </div>
    </Layout>
  );
};

CreateToken.defaultProps = {};

export default CreateToken;
