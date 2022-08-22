import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { capitalize } from 'lodash';

import { dispatch } from 'store/rematch';
import { selectAccountWalletName, selectTheme } from 'store/selectors';
import { themeNames } from 'util/theming';

import GenericPanel from 'components/_General/GenericPanel';
import Select from 'components/_General/Select';
import ChangePasswordForm from './ChangePasswordForm';
import { Subsection } from './Settings.common';

const SplitSection = styled.div`
  display: flex;
`;

const themeOptions = themeNames.map(name => ({ label: capitalize(name), value: name }));
const currencies = ['USD'];
const currencyOptions = currencies.map(currency => ({ label: currency, value: currency }));

const Settings = () => {
  const theme = useSelector(selectTheme);
  const existingWalletName = useSelector(selectAccountWalletName);

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
      {existingWalletName && <ChangePasswordForm />}
    </GenericPanel>
  );
};

export default Settings;
