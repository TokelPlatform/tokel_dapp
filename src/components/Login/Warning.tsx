import React from 'react';
import styled from '@emotion/styled';
import warning from './assets/warningIcon.svg';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  img {
    margin-right: 0.5rem;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    color: var(--color-white);
    font-weight: 400;
  }
  p {
    color: var(--color-gray);
    font-size: var(--font-size-additional-p);
  }
  margin-bottom: 2rem;
`;

const Warning = () => {
  return (
    <Container>
      <img alt="warning" src={warning} />
      <div>
        <h3>Important: please back up your seed phrase and WIF now!</h3>
        <p>
          We recommend storing it offline.{' '}
          <a href="#">Learn security best practices</a>
        </p>
      </div>
    </Container>
  );
};

export default Warning;
