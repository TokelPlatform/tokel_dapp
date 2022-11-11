/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import {
  selectChosenToken,
  selectCurrentTokenInfo,
  selectLockedTransactionsBalance,
  selectMyTokenDetails,
  selectUnspentBalance,
} from 'store/selectors';
import { isAddressValid, processPossibleBN } from 'util/helpers';
import { FEE, ResourceType, TICKER } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import InputWithLabel from 'components/_General/InputWithLabel';
import ValueRow from 'components/_General/ValueRow';
import { RowWrapper, VSpaceBig, VSpaceMed, VSpaceSmall } from '../common';

const SendFormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  font-size: var(--font-size-additional-p);
  color: var(--color-gray);
  height: var(--modal-content-height);
`;

type SendFormProps = {
  onSubmit: (destpubkey: string, tokenid: string, amount: number) => void;
  type: ResourceType;
};

const getAmount = (e, balance) => {
  const amount = e.target ? e.target.value : e;
  if (!balance) {
    return 0;
  }
  if (amount >= balance) {
    return balance;
  }
  return amount;
};

const SendForm = ({ onSubmit, type }: SendFormProps): React.ReactElement => {
  const lockedBalance = useSelector(selectLockedTransactionsBalance);
  const coinBalance = useSelector(selectUnspentBalance) - lockedBalance;
  const chosenToken = useSelector(selectChosenToken);
  const tokens = useSelector(selectMyTokenDetails);
  const currentToken = useSelector(selectCurrentTokenInfo);
  const { balance } = currentToken;
  const isNFT = type === ResourceType.NFT;

  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState(isNFT ? '1' : '');
  // const [fiatAmount, setFiatAmount] = React.useState('');s
  const [error, setError] = React.useState('');
  const [errorAmount, setErrorAmount] = React.useState('');

  const remaining = Number(processPossibleBN(balance)) - Number(amount);

  const handleSetAmount = e => {
    setErrorAmount('');
    setAmount(getAmount(e, balance));
  };

  const handleSubmit = () => {
    setError('');
    setErrorAmount('');
    let err = false;

    if (coinBalance < FEE) {
      setError(`Not enough ${TICKER} to pay for fee`);
      err = true;
    }
    if (Number(amount) <= 0 || remaining < 0) {
      setErrorAmount('Invalid amount');
      err = true;
    }
    if (!isAddressValid(recipient)) {
      setError('Invalid recipient address');
      err = true;
    }
    if (err) {
      return null;
    }
    return onSubmit(recipient, currentToken.tokenid, Number(amount));
  };

  return (
    <SendFormRoot>
      <h3
        css={css`
          margin-top: 0;
        `}
      >
        {tokens[chosenToken].name} ({processPossibleBN(balance)})
      </h3>
      <InputWithLabel
        id="recipient"
        onChange={e => {
          setError('');
          setRecipient(e.target.value);
        }}
        onKeyDown={() => ''}
        value={recipient}
        placeholder={`Enter recipient ${TICKER} address`}
        autoFocus
        label="Recipient"
        error={error}
      />
      {!isNFT && (
        <InputWithLabel
          id="amount"
          onChange={handleSetAmount}
          onKeyDown={() => ''}
          value={amount}
          placeholder="0"
          label="Amount"
          error={errorAmount}
          button={{
            text: 'MAX',
            onClick: () => handleSetAmount(balance),
          }}
        />
      )}
      <VSpaceSmall />
      <ValueRow keyProp="Network Fee" value={`${FEE} ${TICKER}`} />
      <VSpaceMed />
      {!isNFT && (
        <ValueRow
          keyProp={`Remaining balance ${tokens[chosenToken].name}`}
          value={Math.max(0, remaining).toString()}
        />
      )}
      <VSpaceBig />
      <RowWrapper center>
        <Button onClick={handleSubmit} customWidth="170px" theme="purple">
          Send
        </Button>
      </RowWrapper>
      <VSpaceMed />
    </SendFormRoot>
  );
};

export default SendForm;
