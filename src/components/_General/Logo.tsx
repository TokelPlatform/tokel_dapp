import React from 'react';

import styled from '@emotion/styled';

import logoPath from 'assets/logo.svg';

const StyledLogo = styled.img`
  height: 50px;
  width: 50px;
  margin-bottom: 1.5rem;
`;

const Logo = () => <StyledLogo alt="tokel-logo" src={logoPath} />;

export default Logo;
