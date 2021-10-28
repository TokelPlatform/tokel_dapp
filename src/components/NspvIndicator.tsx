import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectNspvStatus } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';

const NspvIndicatorRoot = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  margin: 0 2rem;
`;

type StatusIconProps = {
  nspvStatus: number;
};

const StatusIcon = styled.div<StatusIconProps>`
  height: 12px;
  width: 12px;
  border-radius: 100%;
  background-color: ${p => {
    switch (p.nspvStatus) {
      case 1:
        return V.color.growth;
      case 2:
        return V.color.slate;
      default:
        return V.color.danger;
    }
  }};
`;

const StatusText = styled.span`
  margin-left: 0.35rem;
  font-size: ${V.font.p};
  color: ${V.color.slate};
`;

const NspvIndicator = () => {
  const nspvStatus = useSelector(selectNspvStatus);
  const [nspvLocalStatus, setNspvLocalStatus] = useState(1);

  useEffect(() => {
    setNspvLocalStatus(Number(nspvStatus));
  }, [nspvStatus]);

  return (
    <NspvIndicatorRoot
      onClick={() => {
        setNspvLocalStatus(2);
        setTimeout(() => {
          sendToBitgo(BitgoAction.RECONNECT);
          dispatch.environment.UPDATE_NSPV_STATUS(!nspvStatus);
        }, 1000);
      }}
    >
      <StatusIcon nspvStatus={nspvLocalStatus} />
      <StatusText>nspv</StatusText>
    </NspvIndicatorRoot>
  );
};

export default NspvIndicator;
