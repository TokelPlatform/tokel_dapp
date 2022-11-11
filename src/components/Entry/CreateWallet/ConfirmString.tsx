import React from 'react';

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

const ConfirmStringRoot = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: center;
  button:nth-of-type(1) {
    position: absolute;
    left: 6px;
    top: 6px;
  }
  h2 {
    margin-top: 8px;
  }
  p {
    color: var(--color-gray);
    margin: 1rem 0 1rem 0;
    width: 450px;
    text-align: center;
  }
`;

const ConfirmString = ({ title, desc, goBack, forward, originalString }: CredentialsRowProps) => {
  const [error, setError] = React.useState('');
  const [value, setValue] = React.useState('');

  const handleClick = (): void => {
    if (value === originalString) {
      forward();
    } else {
      setError('The value you entered is not the same as the generated one');
    }
  };
  return (
    <ConfirmStringRoot>
      <BackButton onClick={goBack} />
      <h2>{title}</h2>
      <p>{desc}</p>
      <TextArea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.currentTarget.value)}
        height="72px"
        width="464px"
      />
      <ErrorMessage>{error}</ErrorMessage>
      <Button onClick={handleClick} customWidth="170px" theme="purple">
        Confirm
      </Button>
      <VSpaceMed />
    </ConfirmStringRoot>
  );
};

export default ConfirmString;
