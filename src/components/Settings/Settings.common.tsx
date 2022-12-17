import React from 'react';

import styled from '@emotion/styled';

import { V } from 'util/theming';

const SubsectionRoot = styled.div`
  width: 100%;
  margin-bottom: 3rem;
  padding: 0 14px;
`;

const SubsectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
  font-size: 20px;
  color: ${V.color.slate};
`;

const SubsectionSubtitle = styled.span`
  color: ${V.color.growth};
  font-size: ${V.font.p};
  margin-right: 50px;
`;

const SubsectionBody = styled.div<{ contrast?: boolean }>`
  background-color: ${p => (p.contrast ? V.color.backHard : 'none')};
  border-radius: ${V.size.borderRadius};
  margin-left: -6px;
`;

export interface SubsectionProps {
  name: string;
  subtitle?: string;
  contrast?: boolean;
  children: React.ReactNode;
}

export const Subsection = ({ name, subtitle, contrast, children }: SubsectionProps) => (
  <SubsectionRoot>
    <SubsectionHeader>
      {name} {subtitle && <SubsectionSubtitle>{subtitle}</SubsectionSubtitle>}
    </SubsectionHeader>
    <SubsectionBody contrast={contrast}>{children}</SubsectionBody>
  </SubsectionRoot>
);
