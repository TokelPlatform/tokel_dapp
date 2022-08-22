import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { capitalize } from 'lodash';

import { dispatch } from 'store/rematch';
import { selectTheme } from 'store/selectors';
// import { Responsive } from 'util/helpers';
import { V, themeNames } from 'util/theming';

import GenericPanel from 'components/_General/GenericPanel';
import Select from 'components/_General/Select';

// import Updater from './Updater';

const SubsectionRoot = styled.div`
  width: 100%;
  margin-bottom: 3rem;
  padding: 0 14px;
`;

const SubsectionHeader = styled.div`
  margin-bottom: 1rem;
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
  children: React.ReactNode;
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

const themeOptions = themeNames.map(name => ({ label: capitalize(name), value: name }));
const currencies = ['USD'];
const currencyOptions = currencies.map(currency => ({ label: currency, value: currency }));

const Settings = () => {
  const theme = useSelector(selectTheme);

  return (
    <GenericPanel thin title="Settings">
      <SplitSection>
        <Subsection name="Theme">
          <Select
            onSelect={dispatch.environment.SET_THEME}
            options={themeOptions}
            defaultValue={theme}
          />
        </Subsection>
        <Subsection name="Default Fiat Currency">
          <Select onSelect={console.log} options={currencyOptions} defaultValue={currencies[0]} />
        </Subsection>
      </SplitSection>
      {/* <Subsection name="Updates" contrast>
        <Updater />
      </Subsection> */}
    </GenericPanel>
  );
};

export default Settings;
