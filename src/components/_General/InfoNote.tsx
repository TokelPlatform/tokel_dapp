import React from 'react';

import styled from '@emotion/styled';

import { GrayLabelUppercase, VSpaceBig } from 'components/Dashboard/widgets/common';

type InputProps = {
  title: string;
  subtitle?: Array<string | JSX.Element>;
};

const Message = styled(GrayLabelUppercase)`
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
  .subtitle {
    text-transform: none;
  }
`;

const InfoNote = ({ title, subtitle }: InputProps) => {
  return (
    <div>
      <VSpaceBig />
      <Message>
        {' '}
        <text>
          {title}
          <br /> <br /> <text className="subtitle"> {subtitle}</text>{' '}
        </text>
      </Message>
    </div>
  );
};

InfoNote.defaultProps = {
  subtitle: '',
};
export default InfoNote;
