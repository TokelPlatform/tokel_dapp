import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectAccountPubKey, selectModalOptions } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { ResourceType } from 'vars/defines';

import SendForm from 'components/Dashboard/widgets/Wallet/SendForm';
import SendTokenForm from 'components/Dashboard/widgets/Wallet/SendTokenForm';
import TxConfirmation from 'components/Dashboard/widgets/Wallet/TxConfirmation';

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

export type SendModalOpts = {
  type: ResourceType;
};

const Send = () => {
  const options = useSelector(selectModalOptions) as SendModalOpts;
  const myAddress = useSelector(selectAccountAddress);
  const mypubkey = useSelector(selectAccountPubKey);
  const sender = options.type === ResourceType.TOKEL ? myAddress : mypubkey;

  const [confirmation, setConfirmation] = React.useState(false);
  const [recipient, setRecipient] = React.useState<string>(null);
  const [amountToSend, setAmountToSend] = React.useState<string>(null);

  const handleSubmit = (address: string, amount: string) => {
    dispatch.currentTransaction.RESET_TX();
    setRecipient(address);
    setAmountToSend(amount);
    setConfirmation(true);
    try {
      sendToBitgo(BitgoAction.SPEND, { address, amount: amount.toString() });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTokenSubmit = (destpubkey: string, tokenid: string, amount: number) => {
    dispatch.currentTransaction.RESET_TX();
    setRecipient(destpubkey);
    setAmountToSend(amount.toString());
    setConfirmation(true);
    try {
      sendToBitgo(BitgoAction.TOKEN_V2_TRANSFER, { destpubkey, tokenid, amount });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SendRoot>
      {confirmation ? (
        <TxConfirmation recipient={recipient} amount={amountToSend} from={sender} />
      ) : options.type === ResourceType.TOKEL ? (
        <SendForm onSubmit={handleSubmit} />
      ) : (
        <SendTokenForm type={options.type} onSubmit={handleTokenSubmit} />
      )}
    </SendRoot>
  );
};

export default Send;
