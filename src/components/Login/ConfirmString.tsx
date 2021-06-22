import React, { ChangeEvent, useState } from 'react';

import styled from '@emotion/styled';

import BackButton from 'components/_General/BackButton';
import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import TextArea from 'components/_General/TextArea';
import { VSpaceMed } from 'components/Dashboard/widgets/common';

type CredentialsRowProps = {
  title: string;
  originalString: string;
  desc: string;
  goBack: () => void;
  forward: () => void;
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 26% 10% 45% 12.75%;
  justify-items: center;
  align-items: center;
  button:nth-of-type(1) {
    position: absolute;
    left: 7.75rem;
    top: 5.5rem;
    cursor: pointer;
  }
  p:nth-of-type(1) {
    color: var(--color-gray);
    margin: 1.5rem 0 1.85rem 0;
    width: 450px;
    text-align: center;
  }
`;

const ConfirmString = ({ title, desc, goBack, forward, originalString }: CredentialsRowProps) => {
  const [error, setError] = useState('');
  const [value, setValue] = useState('');

  const handleClick = (): void => {
    if (value === originalString) {
      forward();
    } else {
      setError('The value you entered is not the same as the generated one');
    }
  };
  return (
    <Container>
      <BackButton onClick={goBack} />
      <h1>{title}</h1>
      <p>{desc}</p>
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value)}
        height="72px"
        width="464px"
      />
      <ErrorMessage>{error}</ErrorMessage>
      <Button onClick={handleClick} customWidth="170px" theme="purple">
        Confirm
      </Button>
      <VSpaceMed />
    </Container>
  );
};

export default ConfirmString;
