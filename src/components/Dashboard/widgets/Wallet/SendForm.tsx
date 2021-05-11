/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';

import styled from '@emotion/styled';

import { formatDec, formatFiat, isAddressValid, limitLength } from 'util/helpers';
import { FEE, FIAT_CURRENCY, TICKER, USD_VALUE } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import Input from 'components/_General/Input';
import InputWithLabel from 'components/_General/InputWithLabel';
import ValueRow from 'components/_General/ValueRow';
import { GrayLabel, VSpaceBig, VSpaceMed, VSpaceTiny } from '../common';

const SendFormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  font-size: var(--font-size-additional-p);
  color: var(--color-gray);
  height: 340px;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const CurrencyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 36px;
  border-left: 1px solid var(--color-lighterBlack);
  padding-left: 8px;
  margin: 0px 12px 12px 120px;
  color: var(--color-darkerGray);
  font-size: var(--font-size-p);
`;

const Approx = styled.p`
  margin: 0 1rem;
  padding-top: 0.5rem;
  color: var(--color-darkerGray);
`;

const balance = 10;

type SendFormProps = {
  onSubmit: (arg1: string, arg2: string) => void;
};

const SendForm = ({ onSubmit }: SendFormProps): ReactElement => {
  const [recepient, setRecepient] = useState('');
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [error, setError] = useState('');
  const remaining = balance - Number(amount);

  const handleSetAmount = (e, fiat) => {
    let v = e.target.value;
    if (v > balance) {
      v = balance;
    } else {
      v = limitLength(v, 10);
    }
    if (fiat) {
      setFiatAmount(v);
      setAmount(formatDec(v / USD_VALUE));
    } else {
      setAmount(v);
      setFiatAmount(formatFiat(v * USD_VALUE));
    }
  };

  const handleSubmit = () => {
    setError('');
    if (!isAddressValid(recepient)) {
      setError('Invalid recepient address');
    } else {
      onSubmit(recepient, amount);
    }
  };

  return (
    <SendFormRoot>
      <InputWithLabel
        id="recepient"
        onChange={e => setRecepient(e.target.value)}
        onKeyDown={() => ''}
        value={recepient}
        placeholder={`Enter ${TICKER} address`}
        width="390px"
        autoFocus
        label="Recepient"
        error={error}
      />
      <label htmlFor="amount">
        <GrayLabel>Amount</GrayLabel>
        <VSpaceTiny />
        <RowWrapper>
          <RowWrapper>
            <Input
              id="amount"
              onChange={e => handleSetAmount(e, false)}
              onKeyDown={() => ''}
              value={amount}
              placeholder="0.00"
              width="175px"
              type="number"
            />
            <CurrencyWrapper>{TICKER}</CurrencyWrapper>
          </RowWrapper>
          <Approx>≈</Approx>
          <RowWrapper>
            <Input
              id="amountUSD"
              onChange={e => handleSetAmount(e, true)}
              onKeyDown={() => ''}
              value={fiatAmount}
              placeholder="0.00"
              type="number"
              width="175px"
            />
            <CurrencyWrapper>{FIAT_CURRENCY}</CurrencyWrapper>
          </RowWrapper>
        </RowWrapper>
      </label>
      <VSpaceBig />
      <ValueRow keyProp="Network Fee" value={`${FEE} ${TICKER} ≈ ${formatFiat(FEE * USD_VALUE)}`} />
      <VSpaceMed />
      <ValueRow
        keyProp="Remaining balance"
        value={`${remaining} ${TICKER} ≈ ${formatFiat(remaining * USD_VALUE)}`}
      />
      <VSpaceBig />
      <RowWrapper>
        <Button onClick={handleSubmit} customWidth="170px" theme="purple">
          Send
        </Button>
      </RowWrapper>
      <VSpaceMed />
    </SendFormRoot>
  );
};

export default SendForm;
