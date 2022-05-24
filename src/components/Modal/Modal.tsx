import React, { ReactElement, useEffect } from 'react';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import timesSvg from 'assets/times.svg';
import useLockScroll from 'hooks/lock-scroll';
import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { dispatch } from 'store/rematch';

export const ModalRoot = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-modal-overlay);
  overflow: auto;
  z-index: 100;
  opacity: 0;
`;

const ModalPanel = styled(motion.div)<{ size?: 'small' | 'medium' | 'large' }>`
  width: 100%;
  max-width: min(
    ${props => (props.size === 'large' ? '980px' : props.size === 'medium' ? '780px' : '440px')},
    90%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid var(--color-modal-border);
  border-radius: var(--border-radius);
  background-color: var(--color-modal-bg);
  color: var(--color-modal-fg);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  font-size: 1.4rem;
  border-bottom: 1px solid var(--color-modal-border);
`;

const StyledTimes = styled.div`
  background-color: var(--color-modal-fg-lc);
  height: 16px;
  width: 16px;
  mask: url(${timesSvg}) no-repeat center / cover;
  cursor: pointer;
  &:hover {
    background-color: var(--color-modal-fg);
  }
`;

const Content = styled.div`
  padding: 25px;
`;

const close = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);
const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && close();

type ModalProps = {
  title: string;
  children: ReactElement;
  size?: 'small' | 'medium' | 'large';
};

const Modal = ({ title, size, children }: ModalProps) => {
  // prevent anything in the background from being scrolled while modal is open
  useLockScroll();

  // close modal if click anywhere outside the content or press ESC
  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <ModalRoot initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
      <ModalPanel
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15, ease: [0.22, 0.54, 0, 1] }}
        size={size}
      >
        <Header>
          {title}
          <StyledTimes onClick={close} />
        </Header>
        <Content>{children}</Content>
      </ModalPanel>
    </ModalRoot>
  );
};

export default Modal;
