/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';

import styled from '@emotion/styled';

import { formatFiat, isAddressValid, limitLength, stripNonNumbers } from 'util/helpers';

import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import { VSpaceBig, VSpaceMed, VSpaceTiny } from '../common';

const SendFormRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  font-size: var(--font-size-additional-p);
  color: var(--color-gray);
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    margin: 0;
  }
`;

const Approx = styled.p`
  margin: 0 1rem;
  padding-top: 0.5rem;
  color: var(--color-darkerGray);
`;

const currency = 'TKL';
const fiatCurrency = 'USD';
const fiatValue = 1.4;
const networkFee = 0.0003;
const balance = 10;

const SendForm = (): ReactElement => {
  const [recepient, setRecepient] = useState('');
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [error, setError] = useState('');
  const remaining = balance - Number(amount);

  const handleSetAmount = e => {
    let v = e.target.value;
    if (v > balance) {
      v = balance;
    } else {
      v = stripNonNumbers(v);
      v = limitLength(v, 10);
    }
    setAmount(v);
    setFiatAmount(formatFiat(v * fiatValue));
  };

  const handleSubmit = () => {
    setError('');
    if (!isAddressValid(recepient)) {
      setError('Invalid recepient address');
    }
  };

  return (
    <SendFormRoot>
      <label htmlFor="recepient">
        <span>Recepient</span>
        <VSpaceTiny />
        <Input
          id="recepient"
          onChange={e => setRecepient(e.target.value)}
          onKeyDown={() => ''}
          value={recepient}
          placeholder={'Enter '.concat(currency, ' address')}
          width="390px"
          autoFocus
        />{' '}
        <div style={{ textAlign: 'right' }}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      </label>
      <label htmlFor="amount">
        <span>Amount</span>
        <VSpaceTiny />
        <RowWrapper>
          <RowWrapper>
            <Input
              id="amount"
              onChange={e => handleSetAmount(e)}
              onKeyDown={() => ''}
              value={amount}
              placeholder="0.00"
              width="175px"
            />
            <CurrencyWrapper>{currency}</CurrencyWrapper>
          </RowWrapper>
          <Approx>≈</Approx>
          <RowWrapper>
            <Input
              id="amount"
              onChange={e => setFiatAmount(e.target.value)}
              onKeyDown={() => ''}
              value={fiatAmount}
              placeholder="0.00"
              width="175px"
            />
            <CurrencyWrapper>{fiatCurrency}</CurrencyWrapper>
          </RowWrapper>
        </RowWrapper>
      </label>
      <VSpaceBig />
      <div style={{ width: '100%' }}>
        <Row>
          <p>Network Fee</p>
          <p>
            {networkFee} {currency} ≈ ${formatFiat(networkFee * fiatValue)}
          </p>
        </Row>
        <VSpaceMed />
        <Row>
          <p>Remaining balance</p>
          <p>
            {remaining} {currency} ≈ ${formatFiat(remaining * fiatValue)}
          </p>
        </Row>
      </div>
      <VSpaceBig />
      <VSpaceMed />
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
