import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { Platform, usePlatform } from 'hooks/platform';
import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';
import { Colors, ModalName, TOPBAR_HEIGHT } from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';
import { HSpaceSmall } from 'components/Dashboard/widgets/common';
import WindowControls from 'components/WindowControls';

// import User from './User';

type TopBarProps = {
  bgColor?: string;
};

const TopBarRoot = styled.div<TopBarProps>`
  background-color: ${({ bgColor }) => bgColor ?? 'var(--color-almostBlack)'};
  height: ${TOPBAR_HEIGHT}px;
  width: 100%;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`;

const RightSideContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const TopBar = ({ bgColor }: TopBarProps) => {
  const address = useSelector(selectAccountAddress);
  const isWindowsOrLinux = [Platform.WINDOWS, Platform.LINUX].includes(usePlatform());

  return (
    <TopBarRoot bgColor={bgColor}>
      {isWindowsOrLinux ? <WindowControls /> : <div />}
      {address ? (
        <RightSideContainer>
          <ButtonSmall onClick={() => dispatch.environment.SET_MODAL(ModalName.FEEDBACK)}>
            Feedback
          </ButtonSmall>
          <HSpaceSmall />
          <ButtonSmall theme={Colors.TRANSPARENT} onClick={() => dispatch.account.logout()}>
            Logout
          </ButtonSmall>
        </RightSideContainer>
      ) : (
        <div />
      )}
    </TopBarRoot>
  );
};

export default TopBar;
