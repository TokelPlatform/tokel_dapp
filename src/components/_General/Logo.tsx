import React from 'react';
import styled from '@emotion/styled';

const StyledLogo = styled.img`
  height: 50px;
  width: 50px;
  margin-bottom: 1.5rem;
`;

const Logo = () => <StyledLogo alt="tokel-logo" src="../assets/logo.png" />;

export default Logo;
