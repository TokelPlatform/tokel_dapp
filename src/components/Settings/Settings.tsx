import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { capitalize } from 'lodash';

import { dispatch } from 'store/rematch';
import { selectTheme } from 'store/selectors';
import { Responsive } from 'util/helpers';
import { V, themeNames } from 'util/theming';

import GenericPanel from 'components/_General/GenericPanel';
import Select from 'components/_General/Select';
import Updater from './Updater';

const SubsectionRoot = styled.div`
  /* padding: 8px; */
  width: 50%;
  ${Responsive.below.L} {
    width: 100%;
  }
  margin-bottom: 28px;
  padding: 0 14px;
`;

const SubsectionHeader = styled.div`
  margin-bottom: 16px;
  font-size: 20px;
  color: ${V.color.slate};
`;

const SubsectionBody = styled.div<{ contrast?: boolean }>`
  background-color: ${p => (p.contrast ? V.color.backHard : 'none')};
  border-radius: ${V.size.borderRadius};
  margin-left: -6px;
`;

type SubsectionProps = {
  name: string;
  contrast?: boolean;
  children: ReactNode;
};

const Subsection = ({ name, contrast, children }: SubsectionProps) => (
  <SubsectionRoot>
    <SubsectionHeader>{name}</SubsectionHeader>
    <SubsectionBody contrast={contrast}>{children}</SubsectionBody>
  </SubsectionRoot>
);

const SplitSection = styled.div`
  display: flex;
`;

const UpdateText = styled.p`
  color: ${V.color.frontSoft};
  padding: 18px;
`;

const themeOptions = themeNames.map(name => ({ label: capitalize(name), value: name }));
const currencyOptions = ['None'].map(currency => ({ label: currency, value: currency }));

const Settings = () => {
  const theme = useSelector(selectTheme);

  return (
    <GenericPanel thin title="Settings">
      <Subsection name="Updates" contrast>
        <UpdateText>
          <Updater />
        </UpdateText>
      </Subsection>
      <SplitSection>
        <Subsection name="Theme">
          <Select
            onSelect={dispatch.environment.SET_THEME}
            options={themeOptions}
            defaultValue={theme}
          />
        </Subsection>
        <Subsection name="Default Currency">
          <Select onSelect={console.log} options={currencyOptions} defaultValue="None" />
        </Subsection>
      </SplitSection>
    </GenericPanel>
  );
};

export default Settings;
