/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectAssets, selectChosenAsset } from 'store/selectors';
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
  const amount = e.target ? e.target.value : e;
  if (!balance) {
    return 0;
  }
  if (amount > balance - FEE) {
    return balance - FEE;
  }
  return limitLength(amount.toString(), 10);
};

const SendForm = ({ onSubmit }: SendFormProps): ReactElement => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  // const [fiatAmount, setFiatAmount] = useState('');
  const [error, setError] = useState('');
  const [errorAmount, setErrorAmount] = useState('');
  const chosenAsset = useSelector(selectChosenAsset);
  const theAsset = useSelector(selectAssets).find(item => item.ticker === chosenAsset);

  const remaining = theAsset.balance ? formatFiat(theAsset.balance - Number(amount) - FEE) : 0;

  const handleSetAmount = e => {
    setErrorAmount('');
    const v = getAmount(e, theAsset.balance);
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
        onKeyDown={() => ''}
        value={recipient}
        placeholder={`Enter ${TICKER} address`}
        width="390px"
        autoFocus
        label="Recipient"
        error={error}
      />
      <label htmlFor="amount">
        <RowWrapper>
          <GrayLabel style={{ marginLeft: '2px' }}>Amount</GrayLabel>
          <span style={{ marginLeft: '4px' }}> {`(balance: ${theAsset.balance})`}</span>
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
              error={errorAmount}
            />
            {/* <CurrencyWrapper>{TICKER}</CurrencyWrapper> */}
          </RowWrapper>
          <MaxButtonWrapper>
            <ButtonSmall
              style={{
                padding: '9px 12px',
              }}
              theme="transparent"
              onClick={() => handleSetAmount(theAsset.balance)}
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
