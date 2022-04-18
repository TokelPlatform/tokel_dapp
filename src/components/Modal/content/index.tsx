import React, { ReactElement } from 'react';

import { ModalName } from 'vars/defines';

import ConfirmTokenCreationModal from 'components/CreateToken/ConfirmTokenCreationModal';
import TokenCreatedTx from 'components/CreateToken/TokenCreatedTx';
import ConfirmOrderModal from 'components/Marketplace/ConfirmOrderModal';
import Feedback from './Feedback';
import IpfsExplainer from './IpfsExplainer';
import Receive from './Receive';
import Send from './Send';
import TxDetail from './TxDetail';

interface ModalPayloadType {
  title: string;
  component: ReactElement;
  size?: 'small' | 'large';
}

interface ModalCollectionType {
  [key: string]: ModalPayloadType;
}

export default {
  [ModalName.RECEIVE]: { title: 'Your wallet', component: <Receive /> },
  [ModalName.SEND]: { title: 'Send', component: <Send /> },
  [ModalName.FEEDBACK]: { title: 'Feedback', component: <Feedback /> },
  [ModalName.TX_DETAIL]: { title: 'Transaction detail', component: <TxDetail /> },
  [ModalName.CONFIRM_TOKEN_CREATION]: {
    title: 'Confirm token creation',
    component: <ConfirmTokenCreationModal />,
    size: 'large',
  },
  [ModalName.TOKEN_CREATED]: {
    title: 'Transaction detail',
    component: <TokenCreatedTx />,
  },
  [ModalName.IPFS_EXPLAINER]: {
    title: 'Store your digital media correctly',
    component: <IpfsExplainer />,
  },
  [ModalName.CONFIRM_MARKET_ORDER]: {
    title: 'Confirm market order',
    component: <ConfirmOrderModal />,
    size: 'medium',
  },
} as ModalCollectionType;
