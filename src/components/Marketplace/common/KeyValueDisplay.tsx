import styled from '@emotion/styled';

import { V } from 'util/theming';

const KeyValueDisplay = styled.div<{ color?: string }>`
  margin-bottom: 15px;
  margin-right: 10px;

  span {
    color: ${V.color.frontSoft};
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    overflow-wrap: break-word;
    ${props => !!props.color && `color: ${V.color[props.color]}`};
  }
`;

export default KeyValueDisplay;
