import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import TextArea from '../_General/TextArea';
import Button from '../_General/Button';
import Logo from '../_General/Logo';
import SmallButton from '../_General/SmallButton';

type CredentialsRowProps = {
  title: string;
  originalString: string;
  desc: string;
  goBack: () => void;
  forward: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button:nth-of-type(1) {
    position: absolute;
    left: 8.75rem;
    top: 5.5rem;
    cursor: pointer;
  }
  p:nth-of-type(1) {
    color: var(--color-gray);
    margin: 1.5rem 0 0 0;
    width: 450px;
    text-align: center;
  }
`;
const Error = styled.p`
  height: 1rem;
  margin: 0.5rem 0;
  color: var(--color-danger);
`;

const ConfirmString = ({
  title,
  desc,
  goBack,
  forward,
  originalString,
}: CredentialsRowProps) => {
  const [error, setError] = useState('');
  const [value, setValue] = useState('');

  const handleClick = (): void => {
    if (value === originalString) {
      forward();
    } else {
      setError('The values do not match');
    }
  };
  return (
    <Container>
      <Logo />
      <SmallButton onClick={goBack} />
      <h1>{title}</h1>
      <p>{desc}</p>
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.currentTarget.value)
        }
        height="72px"
        width="464px"
      />
      <Error>{error}</Error>
      <Button
        onClick={handleClick}
        customWidth="170px"
        buttonText="Confirm"
        theme="purple"
      />
    </Container>
  );
};

export default ConfirmString;
