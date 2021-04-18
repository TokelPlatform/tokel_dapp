import React from 'react';
import styled from '@emotion/styled';
import CopyToClipboard from '../_General/CopyToClipboard';

type CredentialsRowProps = {
  label: string;
  sublabel: string;
  credential: string;
};

const Label = styled.p`
  color: var(--color-gray);
  margin: 0.5rem 0 0 0;
  font-size: 12px;
  span {
    opacity: 0.7;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  p {
    margin: 0 0.5rem 0 0;
    font-size: var(--font-size-additional-p);
    color: var(--color-danger);
    width: 400px;
  }
`;

const CredentialsRow = ({ label, sublabel, credential }: CredentialsRowProps) => {
  return (
    <div>
      <Label>
        {label} <span> {sublabel}</span>
      </Label>
      <Info>
        <p>{credential}</p>
        <CopyToClipboard textToCopy={credential} />
      </Info>
    </div>
  );
};

export default CredentialsRow;
