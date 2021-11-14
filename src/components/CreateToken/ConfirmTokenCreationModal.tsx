import React from 'react';
import { useSelector } from 'react-redux';

import { selectModalOptions } from 'store/selectors';

const ConfirmTokenCreationModal: React.FC = () => {
  const token = useSelector(selectModalOptions);

  return <div>Change me! {token.name}</div>;
};

ConfirmTokenCreationModal.defaultProps = {};

export default ConfirmTokenCreationModal;
