import styled from '@emotion/styled';

import { Responsive } from 'util/helpers';
import { V } from 'util/theming';

import { Column, Columns } from 'components/_General/Grid';
import { Button } from '../buttons';

// dashboard root in dashboard.tsx
const Layout = styled(Columns)`
  background-color: ${V.color.backHard};
  padding: 18px;
  overflow-x: hidden;

  ${Column}:last-child {
    ${Responsive.above.L} {
      padding-left: 18px;
    }

    ${Responsive.below.L} {
      padding-top: 18px;
    }
  }
`;

// widgetcontainer in dashboard/common.tsx
const Box = styled.div<{ flex?: boolean }>`
  background-color: ${V.color.back};
  border: 1px solid ${V.color.backSofter};
  border-radius: ${V.size.borderRadius};

  ${props =>
    props.flex &&
    `
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
  `}

  height: 100%;
  padding: 22px;
`;

const CenteredButtonWrapper = styled.div`
  display: flex;
  ${Button} {
    margin-left: auto;
    margin-right: auto;
  }
`;

export { Layout, Box, CenteredButtonWrapper };
