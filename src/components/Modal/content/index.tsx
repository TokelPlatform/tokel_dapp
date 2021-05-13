import React, { ReactElement } from 'react';

import { ModalName } from 'vars/defines';

import Feedback from './Feedback';
import Receive from './Receive';
import Send from './Send';
import TxDetail from './TxDetail';

interface ModalPayloadType {
  title: string;
  children: ReactElement;
}

interface ModalCollectionType {
  [key: string]: ModalPayloadType;
}

export default {
  [ModalName.RECEIVE]: { title: 'Your wallet address', children: <Receive /> },
  [ModalName.SEND]: { title: 'Send funds', children: <Send /> },
  [ModalName.FEEDBACK]: { title: 'SUBMIT FEEDBACK', children: <Feedback /> },
  [ModalName.TX_DETAIL]: { title: 'Transaction detail', children: <TxDetail /> },
} as ModalCollectionType;
