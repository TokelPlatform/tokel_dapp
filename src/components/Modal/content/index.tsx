import React, { ReactElement } from 'react';

import { ModalName } from 'vars/defines';

import Feedback from './Feedback';
import Receive from './Receive';
import Send from './Send';
import TxDetail from './TxDetail';

interface ModalPayloadType {
  title: string;
  component: ReactElement;
}

interface ModalCollectionType {
  [key: string]: ModalPayloadType;
}

export default {
  [ModalName.RECEIVE]: { title: 'Your wallet', component: <Receive /> },
  [ModalName.SEND]: { title: 'Send', component: <Send /> },
  [ModalName.FEEDBACK]: { title: 'Feedback', component: <Feedback /> },
  [ModalName.TX_DETAIL]: { title: 'Transaction detail', component: <TxDetail /> },
} as ModalCollectionType;
