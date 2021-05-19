/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectUnspentBalance } from 'store/selectors';
import { formatFiat, isAddressValid, limitLength } from 'util/helpers';
import { FEE, TICKER } from 'vars/defines';

import { Button, ButtonSmall } from 'components/_General/buttons';
import Input from 'components/_General/Input';
import InputWithLabel from 'components/_General/InputWithLabel';
import ValueRow from 'components/_General/ValueRow';
import { GrayLabel, RowWrapper, VSpaceBig, VSpaceMed, VSpaceSmall } from '../common';

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

const MaxButtonWrapper = styled.div`
  position: absolute;
  margin-left: 343px;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
`;

type SendFormProps = {
  onSubmit: (arg1: string, arg2: string) => void;
};

const getAmount = (e, balance) => {
  const amount = e.target ? e.target.value : e.toString();
  if (amount > balance - FEE) {
    return balance - FEE;
  }
  return limitLength(amount, 10);
};

const SendForm = ({ onSubmit }: SendFormProps): ReactElement => {
  const [recepient, setRecepient] = useState('');
  const [amount, setAmount] = useState('');
  // const [fiatAmount, setFiatAmount] = useState('');
  const [error, setError] = useState('');
  const balance = useSelector(selectUnspentBalance);

  const remaining = formatFiat(balance - Number(amount) - FEE);

  const handleSetAmount = e => {
    const v = getAmount(e, balance);
    setAmount(v);
    // setFiatAmount(formatFiat(v * USD_VALUE));
  };

  // const handleSetFiatAmount = e => {
  //  @todo uncomment when we have somewhere to pull the price from
  // };

  const handleSubmit = () => {
    setError('');
    if (!isAddressValid(recepient)) {
      return setError('Invalid recepient address');
    }
    return onSubmit(recepient, amount);
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
        <RowWrapper>
          <GrayLabel style={{ marginLeft: '2px' }}>Amount</GrayLabel>
          <span style={{ marginLeft: '4px' }}> {`(balance: ${balance})`}</span>
        </RowWrapper>
        <VSpaceSmall />
        <RowWrapper>
          <RowWrapper>
            <Input
              id="amount"
              onChange={e => handleSetAmount(e)}
              onKeyDown={() => ''}
              value={amount}
              placeholder="0.0000"
              width="336px"
              type="number"
            />
            {/* <CurrencyWrapper>{TICKER}</CurrencyWrapper> */}
          </RowWrapper>
          <MaxButtonWrapper>
            <ButtonSmall
              style={{
                padding: '9px 12px',
              }}
              theme="transparent"
              onClick={() => handleSetAmount(balance)}
            >
              <span style={{ opacity: 0.6 }}>MAX</span>
            </ButtonSmall>
          </MaxButtonWrapper>
          {/*
          <Approx>≈</Approx>
          <RowWrapper>
            <Input
              id="amountUSD"
              onChange={e => handleSetFiatAmount(e)}
              onKeyDown={() => ''}
              value={fiatAmount}
              placeholder="0.0000"
              type="number"
              width="146px"
            />
            <CurrencyWrapper>{FIAT_CURRENCY}</CurrencyWrapper>
          </RowWrapper> */}
        </RowWrapper>
      </label>
      <VSpaceBig />
      <ValueRow
        keyProp="Network Fee"
        value={`${FEE} ${TICKER}`}
        // value={`${FEE} ${TICKER} ≈ ${formatFiat(FEE * USD_VALUE)} USD`}
      />

      <VSpaceMed />
      <ValueRow
        keyProp="Remaining balance"
        value={`${remaining} ${TICKER}`}
        // value={`${remaining} ${TICKER} ≈ ${formatFiat(Number(remaining) * USD_VALUE)} USD`}
      />
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
