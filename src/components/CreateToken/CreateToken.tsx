import React, { useState, useMemo } from 'react';

import styled from '@emotion/styled';
import TokenType from 'util/types/TokenType';
import { V } from 'util/theming';

import Icon from 'components/_General/_UIElements/Icon';

import infoIcon from 'assets/friendlyWarning.svg';
import nftIcon from 'assets/Star.svg';
import tokenMenuIcon from 'assets/Token.svg';
import tokenIcon from 'assets/Token-alt.svg';

import { Column, Columns } from 'components/_General/Grid';
import CreateTokenForm from './Form';

// dashboard root in dashboard.tsx
const Layout = styled(Columns)`
  background-color: ${V.color.backHard};
  padding: 18px;
  overflow-x: hidden;

  ${Column}:last-child {
    padding-left: 18px;
  }
`;

// widgetcontainer in common.tsx
const Box = styled.div<{ flex?: boolean }>`
  background-color: ${V.color.back};
  border: 1px solid ${V.color.backSofter};
  border-radius: ${V.size.borderRadius};

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
  height: 215px;
  min-height: 215px;
  max-height: 215px;
  margin-bottom: 18px;

  p {
    flex-grow: 2;
    margin-top: 0;
    color: ${V.color.frontSoft};
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
        color: ${V.color.front};
      }
    }

    h2 {
      color: ${V.color.frontSoft};
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
      color: ${V.color.frontSoft};
    }

    .icon {
      margin-left: auto;
      margin-right: auto;
      background: var(--gradient-purple-horizontal);
    }
  }
`;

const TokenTypeOption: React.FC<{
  action: () => void;
  selected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <h2>About Fungible Tokens</h2>
            <p>
              You can use fungible tokens to represent ownership of a shared asset, equity of a
              project, membership of a community, or just about anything you can think of.
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
              other use cases, select fungible token.
            </p>
          </>
        );
    }
  }, [typeSelected]);

  const selectNFT = () => setTypeSelected(TokenType.NFT);
  const selectToken = () => setTypeSelected(TokenType.TOKEN);

  return (
    <Layout gapless>
      <Column size={4} vertical>
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
            title="Fungible Token"
            icon={tokenIcon}
          />
        </TokenTypeWidget>
      </Column>
      <Column>
        <FormBox flex={typeSelected === null}>{form}</FormBox>
      </Column>
    </Layout>
  );
};

CreateToken.defaultProps = {};

export default CreateToken;
