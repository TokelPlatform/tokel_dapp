import React from 'react';

import styled from '@emotion/styled';

import { V } from 'util/theming';
import { Colors } from 'vars/defines';

import CopyToClipboard from './CopyToClipboard';

type CopyProps = {
  textToCopy: string;
  label?: string;
  onClick?: () => void;
};

const TextInput = styled.div`
  height: 60px;
  border: 1px solid var(--color-lighterBlack);
  box-sizing: border-box;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${V.color.backHard};
  padding: 0.5rem;
  margin-top: 1rem;
`;

const CopyWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const TextWrapper = styled.p`
  width: 100%;
  overflow-x: auto;
  margin: 0;
  color: ${V.color.slate};
  text-align: left;
  &:hover {
    color: ${V.color.cornflower};
    ${p => (p.onClick ? 'cursor: pointer' : '')}
  }
`;

const TextLabel = styled.p`
  font-size: var(--font-size-small-p);
  margin: 0;
  margin-bottom: 4px;
`;

const CopyTextInput = ({ textToCopy, label, onClick }: CopyProps) => {
  return (
    <TextInput>
      {label && <TextLabel>{label}</TextLabel>}
      <CopyWrapper>
        <TextWrapper onClick={onClick}>{textToCopy}</TextWrapper>
        <CopyToClipboard color={Colors.WHITE} textToCopy={textToCopy} />
      </CopyWrapper>
    </TextInput>
  );
};

export default CopyTextInput;
