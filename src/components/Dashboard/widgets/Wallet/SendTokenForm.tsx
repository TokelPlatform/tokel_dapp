/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectChosenToken, selectCurrentTokenInfo, selectMyTokenDetails } from 'store/selectors';
import { processPossibleBN } from 'util/helpers';
import { FEE, ResourceType, TICKER } from 'vars/defines';

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

const MaxButtonWrapper = styled.div`
  position: absolute;
  margin-left: 343px;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
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

const SendForm = ({ onSubmit, type }: SendFormProps): ReactElement => {
  const chosenToken = useSelector(selectChosenToken);
  const tokens = useSelector(selectMyTokenDetails);
  const currentToken = useSelector(selectCurrentTokenInfo);
  const { balance } = currentToken;
  const isNFT = type === ResourceType.NFT;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(isNFT ? '1' : '');
  // const [fiatAmount, setFiatAmount] = useState('');
  const [error, setError] = useState('');
  const [errorAmount, setErrorAmount] = useState('');

  const remaining = Number(balance) - Number(amount);

  const handleSetAmount = e => {
    setErrorAmount('');
    setAmount(getAmount(e, balance));
  };

  const handleSubmit = () => {
    setError('');
    setErrorAmount('');
    let err = false;
    if (!isNFT && (Number(amount) <= 0 || Number(amount) <= FEE)) {
      setErrorAmount('Invalid amount');
      err = true;
    }
    if (err) {
      return null;
    }
    return onSubmit(recipient, currentToken.tokenid, Number(amount));
  };

  return (
    <SendFormRoot>
      <h3>
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
        placeholder={`Enter recipient ${TICKER} token pubkey`}
        width="390px"
        autoFocus
        label="Recipient"
        error={error}
      />
      <label htmlFor="amount">
        {isNFT ? null : (
          <RowWrapper>
            <GrayLabel style={{ marginLeft: '2px' }}>Amount</GrayLabel>
          </RowWrapper>
        )}
        <RowWrapper>
          <RowWrapper>
            {isNFT ? null : (
              <Input
                id="amount"
                onChange={e => handleSetAmount(e)}
                onKeyDown={() => null}
                value={amount}
                placeholder="0"
                width="336px"
                type="number"
                error={errorAmount}
              />
            )}
          </RowWrapper>
          {!isNFT && (
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
          )}
        </RowWrapper>
      </label>
      <VSpaceSmall />
      <ValueRow keyProp="Network Fee" value={`${FEE} ${TICKER}`} />

      <VSpaceMed />
      {!isNFT && (
        <ValueRow
          keyProp={`Remaining balance ${tokens[chosenToken].name}`}
          value={`${remaining}`}
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
