/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectLockedTransactionsBalance, selectUnspentBalance } from 'store/selectors';
import { formatFiat, isAddressValid, limitLength } from 'util/helpers';
import { FEE, TICKER } from 'vars/defines';

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

// All commented is related to
// https://github.com/TokelPlatform/tokel_app/issues/67

// const CurrencyWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: absolute;
//   height: 36px;
//   padding-left: 8px;
//   margin: 0px 12px 12px 286px;
//   color: var(--color-darkerGray);
//   opacity: 0.6;
//   font-size: var(--font-size-p);
// `;
// const Approx = styled.p`
//   margin: 0 1rem;
//   padding-top: 0.5rem;
//   color: var(--color-darkerGray);
// `;

type SendFormProps = {
  onSubmit: (arg1: string, arg2: string) => void;
};

const getAmount = (e, balance) => {
  const amount = e.target ? e.target.value : e;
  if (!balance) {
    return 0;
  }
  if (amount > balance - FEE) {
    return balance - FEE;
  }
  return limitLength(amount.toString(), 10);
};

const SendForm = ({ onSubmit }: SendFormProps): React.ReactElement => {
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  // const [fiatAmount, setFiatAmount] = React.useState('');
  const [error, setError] = React.useState('');
  const [errorAmount, setErrorAmount] = React.useState('');
  const lockedBalance = useSelector(selectLockedTransactionsBalance);
  const balance = useSelector(selectUnspentBalance) - lockedBalance;

  const remaining = balance ? formatFiat(balance - Number(amount) - FEE) : 0;

  const handleSetAmount = e => {
    setErrorAmount('');
    const v = getAmount(e, balance);
    setAmount(v.toString());
    // setFiatAmount(formatFiat(v * USD_VALUE));
  };

  // const handleSetFiatAmount = e => {
  //  @todo uncomment when we have somewhere to pull the price from
  // };

  const handleSubmit = () => {
    setError('');
    setErrorAmount('');
    let err = false;
    if (Number(amount) <= 0 || Number(amount) <= FEE) {
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
    return onSubmit(recipient, amount);
  };

  return (
    <SendFormRoot>
      <InputWithLabel
        id="recipient"
        onChange={e => {
          setError('');
          setRecipient(e.target.value);
        }}
        value={recipient}
        placeholder={`Enter ${TICKER} address`}
        autoFocus
        label="Recipient"
        error={error}
      />
      <InputWithLabel
        id="amount"
        onChange={handleSetAmount}
        value={amount}
        placeholder="0.0000"
        label={`Amount (spendable balance: ${balance})`}
        error={errorAmount}
        type="number"
        button={{
          text: 'MAX',
          onClick: () => handleSetAmount(balance),
        }}
      />
      <VSpaceSmall />
      <ValueRow keyProp="Network Fee" value={`${FEE} ${TICKER}`} />
      <VSpaceMed />
      <ValueRow keyProp="Remaining balance" value={`${remaining} ${TICKER}`} />
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
