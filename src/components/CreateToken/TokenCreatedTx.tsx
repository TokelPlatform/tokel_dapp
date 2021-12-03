import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dispatch } from 'store/rematch';
import styled from '@emotion/styled';

import {
  selectAccountAddress,
  selectModalOptions,
  selectCurrentTxId,
  selectCurrentTxError,
  selectCurrentTxStatus,
} from 'store/selectors';
import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { ViewType } from 'vars/defines';
import { V } from 'util/theming';
import TokenType from 'util/types/TokenType';

import ExplorerLink from 'components/_General/ExplorerLink';
import { Button } from 'components/_General/buttons';
import Loader from 'components/_General/Spinner';

const Title = styled.h2<{ success: boolean }>`
  color: ${props => (props.success ? V.color.growth : V.color.danger)};
  margin-top: 0;
`;

const TokenCreatedTx: React.FC = () => {
  const { tokenTypeName, tokenTypeNameCapitalized } = useSelector(selectModalOptions) as {
    tokenType: TokenType;
    tokenTypeName: string;
    tokenTypeNameCapitalized: string;
  };

  const address = useSelector(selectAccountAddress);
  const error = useSelector(selectCurrentTxError);
  const txStatus = useSelector(selectCurrentTxStatus);
  const txId = useSelector(selectCurrentTxId);

  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [hasError, setHasError] = useState(false);

  const closeModal = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);
  const goToWallet = () => {
    dispatch.environment.SET_VIEW(ViewType.DASHBOARD);
    closeModal();
  };

  useEffect(() => {
    setIsBroadcasting(txStatus === 0);
    setHasError(txStatus < 0);
  }, [txStatus]);

  useEffect(() => {
    return () => {
      dispatch.currentTransaction.RESET_TX();
    };
  }, []);

  if (isBroadcasting) {
    return (
      <div css={{ textAlign: 'center' }}>
        <Loader bgColor={V.color.modal.bg} />
        <p>Broadcasting transaction...</p>
      </div>
    );
  }

  return (
    <div>
      <Title success={!hasError}>
        {hasError ? `Failed to create ${tokenTypeName}` : `${tokenTypeNameCapitalized} created!`}
      </Title>

      {hasError ? (
        <>
          <p>
            An error has ocurred while broadcasting your {tokenTypeName}: {error}.
          </p>
          <p>
            Please confirm that no transaction has been broacast and try again in a few minutes.
          </p>
          <ExplorerLink txid={address} type="address" />
        </>
      ) : (
        <p>
          A transaction has been broadcast creating your token. Please check your wallet in a few
          minutes.
        </p>
      )}

      {!!txId && (
        <div css={{ marginBottom: '20px' }}>
          <ExplorerLink type="tokens" postfix="transactions" txid={txId} />
        </div>
      )}

      {hasError ? (
        <Button type="button" theme="danger" onClick={closeModal}>
          Go back
        </Button>
      ) : (
        <Button type="button" theme="success" onClick={goToWallet}>
          Go to wallet
        </Button>
      )}
    </div>
  );
};

export default TokenCreatedTx;
