// This file has a lot of similarities with TokenCreatexTx.tsx. Consider merging?

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { dispatch } from 'store/rematch';
import {
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
  selectModalOptions,
} from 'store/selectors';
import { V } from 'util/theming';
import { TokenDetail } from 'util/token-types';

import { Button } from 'components/_General/buttons';
import ExplorerLink from 'components/_General/ExplorerLink';
import Loader from 'components/_General/Spinner';
import AssetWidget from './common/AssetWidget';

const Title = styled.h2<{ success: boolean }>`
  color: ${props => (props.success ? V.color.growth : V.color.danger)};
  margin-top: 0;
`;

const closeModal = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);

const OrderCreatedTx: React.FC = () => {
  const { isFilling, token } = useSelector(selectModalOptions) as {
    isFilling: boolean;
    token: TokenDetail;
  };
  const error = useSelector(selectCurrentTxError);
  const txStatus = useSelector(selectCurrentTxStatus);
  const txId = useSelector(selectCurrentTxId);

  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [hasError, setHasError] = useState(false);

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
      <Title success={!hasError}>{hasError ? `Failed to send order` : `Order sent!`}</Title>

      <AssetWidget asset={token} />

      {hasError ? (
        <>
          <p>
            An error has ocurred while broadcasting your order: <code>{error}</code>.
          </p>
          <p>
            Please confirm that no transaction has been broadcast and try again in a few minutes.
          </p>
        </>
      ) : (
        <p>
          A transaction has been broadcast to the DEX.{' '}
          {isFilling
            ? 'Please check your wallet in a few minutes.'
            : 'You can share the TX ID below with a buyer or seller so they can fulfill it.'}
        </p>
      )}

      {Boolean(txId) && (
        <div css={{ marginBottom: '20px' }}>
          <ExplorerLink type="tx" txid={txId} />
        </div>
      )}

      <Button type="button" theme={hasError ? 'danger' : 'success'} onClick={closeModal}>
        {hasError ? 'Go back' : 'Close'}
      </Button>
    </div>
  );
};

export default OrderCreatedTx;
