import React, { ReactElement, useEffect, useRef } from 'react';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import timesSvg from 'assets/times.svg';
import useLockScroll from 'hooks/lock-scroll';
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

const ModalPanel = styled(motion.div)`
  width: 100%;
  max-width: min(440px, 90%);
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

const close = () => dispatch.environment.SET_MODAL(null);
const handleEscape = e => e.key === 'Escape' && close();

type ModalProps = {
  title: string;
  children: ReactElement;
};

const Modal = ({ title, children }: ModalProps) => {
  // prevent anything in the background from being scrolled while modal is open
  useLockScroll();

  // close modal if click anywhere outside the content or press ESC
  useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // close the modal if the overlay is clicked (but not a child of it)
  const overlayRef = useRef();
  // const [mouseMemory, setMouseMemory] = useState<EventTarget | undefined>();

  // @todo make this functionality conditional (?) as some potential future modals in the app might use it.
  // The current payment modal should not be closed by clicking outside of it

  // const handleOverlayClick = useCallback(
  //   e => {
  //     if (e.target === mouseMemory && e.target === overlayRef.current) {
  //       close();
  //     }
  //   },
  //   [mouseMemory]
  // );

  return (
    <ModalRoot
      ref={overlayRef}
      // onClick={handleOverlayClick}
      // onMouseDown={e => setMouseMemory(e.target)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
    >
      <ModalPanel
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15, ease: [0.22, 0.54, 0, 1] }}
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
