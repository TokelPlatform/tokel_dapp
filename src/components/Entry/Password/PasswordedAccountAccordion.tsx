import React from 'react';
import { useSelector } from 'react-redux';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import PasswordIcon from 'assets/password.svg';
import { decrypt } from 'encryption/core';
import { dispatch } from 'store/rematch';
import { selectEnvError, selectLoginFeedback } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { Colors, SIZES } from 'vars/defines';
import { IWallet } from 'vars/types';

import { SubmitButton } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import { BROKEN_WALLET_MSG } from 'components/BitgoOrchestrator';
import CreatePasswordedWalletForm from './CreatePasswordedWalletForm';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordionRoot = styled(AccordionPrimitive.Root)``;

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  /* overflow: hidden; */
  margin-top: 1;
  &:first-of-type {
    margin-top: 0;
    border-top-left-radius: 4;
    border-top-right-radius: 4;
  }
  &:last-child {
    border-bottom-left-radius: 4;
    border-bottom-right-radius: 4;
  }
  &:focus-within {
    position: relative;
    z-index: 1;
    /* box-shadow: 0 0 0 1px ${V.color.cornflower}; */
  }
`;

const StyledTextualItem = styled.div`
  display: flex;
  padding: 20px;
`;

const StyledAccordionHeader = styled(AccordionPrimitive.Header)`
  all: unset;
  display: flex;
`;

interface TriggerColors {
  fore?: string;
  open?: string;
  closed?: string;
  hover?: string;
}

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger)<{ colors?: TriggerColors }>`
  all: unset;
  font-family: inherit;
  background-color: transparent;
  padding: 0 20px;
  height: 45px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${p => p.colors?.fore ?? V.color.frontSoft};
  cursor: pointer;
  &[data-state='closed'] {
    background-color: ${p => p.colors?.closed ?? V.color.backSoft};
  }
  &[data-state='open'] {
    background-color: ${p => p.colors?.open ?? V.color.backHarder};
  }
  &:hover {
    background-color: ${p => p.colors?.hover ?? V.color.backHarder};
  }
`;

const StyledContent = styled(AccordionPrimitive.Content)`
  font-size: 15px;
  color: ${V.color.front};
  &[data-state='open'] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards;
  }
  &[data-state='closed'] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards;
  }
`;

const StyledContentText = styled.div`
  padding: 15px 20px;
`;

type AccordionTriggerProps = Parameters<typeof StyledAccordionTrigger>[0] & {
  children: React.ReactNode;
};

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, forwardedRef) => (
    <StyledAccordionHeader>
      <StyledAccordionTrigger {...props} ref={forwardedRef}>
        {children}
      </StyledAccordionTrigger>
    </StyledAccordionHeader>
  )
);

type AccordionContentProps = Parameters<typeof StyledContent>[0] & {
  children: React.ReactNode;
};

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, forwardedRef) => (
    <StyledContent {...props} ref={forwardedRef}>
      <StyledContentText>{children}</StyledContentText>
    </StyledContent>
  )
);

interface WalletAccordionProps {
  wallets: Array<IWallet>;
}

const TryPasswordFormRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
`;

const PasswordInputWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const PasswordedAccountLoginForm = ({ wallet }: { wallet: IWallet }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const feedbackMsg = useSelector(selectLoginFeedback);
  const envErrorMsg = useSelector(selectEnvError);

  React.useEffect(() => {
    if (envErrorMsg) {
      setError(envErrorMsg);
      setIsLoading(false);
    }
  }, [envErrorMsg]);

  React.useEffect(() => {
    if (feedbackMsg) {
      if (feedbackMsg === BROKEN_WALLET_MSG) {
        setIsLoading(false);
        setPassword('');
      } else {
        setIsLoading(true);
      }
    }
  }, [feedbackMsg]);

  const tryPassword = async () => {
    if (password.length < SIZES.MIN_PASSWORD_LENGTH) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      const decryptedData = await decrypt(wallet.name, Buffer.from(password));
      dispatch.account.SET_WALLET_FILE_NAME(wallet.name);
      sendToBitgo(BitgoAction.LOGIN, { key: decryptedData.toString() });
      setError('');
    } catch (err) {
      setError('Incorrect password');
    }
    setIsLoading(false);
  };

  return (
    <TryPasswordFormRoot>
      <PasswordInputWrapper>
        <Input
          autoFocus
          value={password}
          onChange={e => {
            setError('');
            dispatch.environment.SET_LOGIN_FEEDBACK(null);
            setPassword(e.target.value);
          }}
          tid="password-input"
          onKeyDown={e => e.key === 'Enter' && tryPassword()}
          icon={PasswordIcon}
          placeholder="password"
          type="password"
          disabled={isLoading}
        />
        <SubmitButton
          text="login"
          theme={Colors.BLACK}
          onClick={tryPassword}
          submitting={isLoading}
          css={{ marginLeft: 10 }}
        />
      </PasswordInputWrapper>
      <ErrorMessage>{error}</ErrorMessage>
    </TryPasswordFormRoot>
  );
};

const WalletAccordion = ({ wallets }: WalletAccordionProps) => {
  const [accordionValue, setAccordionValue] = React.useState(null);

  return (
    <StyledAccordionRoot
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      {wallets.length === 0 && (
        <StyledTextualItem>No wallets found, create one first!</StyledTextualItem>
      )}
      {wallets.map(wallet => (
        <StyledAccordionItem key={wallet.filename} value={wallet.name}>
          <AccordionTrigger>{wallet.name}</AccordionTrigger>
          <AccordionContent>
            <PasswordedAccountLoginForm wallet={wallet} />
          </AccordionContent>
        </StyledAccordionItem>
      ))}
      <StyledAccordionItem value="create-new">
        <AccordionTrigger
          colors={{
            closed: V.color.cornflower,
            open: V.color.cornflowerHard,
            hover: V.color.cornflowerHard,
            fore: V.color.frontSofter,
          }}
        >
          Create new
        </AccordionTrigger>
        <AccordionContent>
          <CreatePasswordedWalletForm onSubmit={setAccordionValue} />
        </AccordionContent>
      </StyledAccordionItem>
    </StyledAccordionRoot>
  );
};

export default WalletAccordion;
