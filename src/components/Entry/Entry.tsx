import React from 'react';

import styled from '@emotion/styled';

import ToggleIcon from 'assets/Toggle.svg';
import { dispatch } from 'store/rematch';
import { V } from 'util/theming';
import { Colors, LoginType, TOPBAR_HEIGHT_PX } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import Link from 'components/_General/Link';
import Logo from 'components/_General/Logo';
import CreateWallet from './CreateWallet/CreateWallet';
import LoginWithPassword from './Password/LoginWithPassword';
import LoginWithPrivateKey from './PrivateKey/LoginWithPrivateKey';

const LoginRoot = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - ${TOPBAR_HEIGHT_PX}px);
  overflow-y: auto;
`;

const CenteredLoginContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: -100px;
  /* max-width: 400px; */
  /* width: 90%; */
  @media (max-height: 500px) {
    height: 100%;
    padding-top: 10px;
  }
`;

const NetworkPrefsButton = styled.button`
  position: absolute;
  top: 14px;
  right: 20px;
  background-color: none;
  border: none;
  height: 18px;
  width: 18px;
  background: ${V.color.frontSoft};
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-image: url('${ToggleIcon}');
  cursor: pointer;
  &:hover {
    background: ${V.color.front};
  }
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  margin-bottom: 40px;
  font-size: ${V.font.h1};
`;

const WelcomeMessage = styled.h2`
  color: ${V.color.frontSoft};
`;

const LoginViewWrapper = styled.div`
  display: flex;
`;

const LoginOptionContainer = styled.div`
  display: flex;
`;

const LoginOptionButton = styled(Button)`
  height: 120px;
  width: 120px;
  margin: 20px;
  font-size: ${V.font.h3};
`;

const LinksToOtherViews = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

interface LoginView {
  type: LoginType;
  title: string;
  component: () => JSX.Element;
}

const LoginViews: Record<LoginType, LoginView> = {
  [LoginType.PASSWORD]: {
    type: LoginType.PASSWORD,
    title: 'Login with Password',
    component: LoginWithPassword,
  },
  [LoginType.PRIVKEY]: {
    type: LoginType.PRIVKEY,
    title: 'Login with Private Key',
    component: LoginWithPrivateKey,
  },
  [LoginType.CREATE]: {
    type: LoginType.CREATE,
    title: 'Create New Wallet',
    component: CreateWallet,
  },
};

const Login = () => {
  const [loginType, setLoginType] = React.useState<null | LoginType>(null);
  const currentLoginView = LoginViews[loginType];

  return (
    <LoginRoot>
      <NetworkPrefsButton onClick={() => dispatch.environment.TOGGLE_SHOW_NETWORK_PREFS()} />
      <CenteredLoginContainer>
        <Heading>
          <Logo />
          {!loginType ? (
            <>
              <HeaderTitle>Welcome to Tokel</HeaderTitle>
              <WelcomeMessage>Future of tokenization</WelcomeMessage>
              <LoginOptionContainer>
                {Object.values(LoginViews).map(view => (
                  <LoginOptionButton
                    theme={Colors.PURPLE}
                    key={view.type}
                    onClick={() => setLoginType(view.type)}
                  >
                    {view.title}
                  </LoginOptionButton>
                ))}
              </LoginOptionContainer>
            </>
          ) : (
            <>
              <HeaderTitle>{currentLoginView.title}</HeaderTitle>
              <LoginViewWrapper>
                <currentLoginView.component />
              </LoginViewWrapper>
              <LinksToOtherViews>
                <Link onClick={() => setLoginType(null)} linkText="Back home" />
                {Object.values(LoginViews).map(loginView => {
                  if (loginView.type === currentLoginView.type) {
                    return null;
                  }
                  return (
                    <Link
                      key={loginView.type}
                      onClick={() => setLoginType(loginView.type)}
                      linkText={loginView.title}
                    />
                  );
                })}
              </LinksToOtherViews>
            </>
          )}
        </Heading>
      </CenteredLoginContainer>
    </LoginRoot>
  );
};

export default Login;
