import React from 'react';

import { css } from '@emotion/react';

import { Box } from 'components/_General/_UIElements/common';

interface FulfillOrderWidgetProps {}

const FulfillOrderWidget: React.FC<FulfillOrderWidgetProps> = () => {
  return <Box css={css(`height: 50%`)}>Fulfill order</Box>;
};

export default FulfillOrderWidget;
