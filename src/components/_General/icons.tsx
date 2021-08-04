import styled from '@emotion/styled';

import { ReactComponent as Chevron } from 'assets/chevron.svg';
import { V } from 'util/theming';

// eslint-disable-next-line import/prefer-default-export
export const ThemedChevron = styled(Chevron)`
  color: ${V.color.front};
`;
