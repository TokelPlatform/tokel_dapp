import React, { ReactElement } from 'react';

import { ModalName } from 'vars/defines';

import Feedback from './Feedback';
import Receive from './Receive';
import Send from './Send';

interface ModalPayloadType {
  title: string;
  children: ReactElement;
}

interface ModalCollectionType {
  [key: string]: ModalPayloadType;
}

export default {
  [ModalName.RECEIVE]: { title: 'Your wallet address', children: <Receive /> },
  [ModalName.SEND]: { title: 'Send', children: <Send /> },
  [ModalName.FEEDBACK]: { title: 'SUBMIT FEEDBACK', children: <Feedback /> },
} as ModalCollectionType;
