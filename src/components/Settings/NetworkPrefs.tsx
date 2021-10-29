import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import timesSvg from 'assets/times.svg';
import { dispatch } from 'store/rematch';
import { selectNetworkPrefs } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { Colors, NetworkType } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import Select from 'components/_General/Select';
import TextArea from 'components/_General/TextArea';

const NetworkPrefsRoot = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 440px;
  width: 400px;
  z-index: 1000;
  left: calc(50% - 200px);
  top: calc(50% - 220px);
  background-color: ${V.color.back};
  border: 1px solid ${V.color.backSoft};
  border-radius: ${V.size.borderRadiusBig};
  box-shadow: 0px 0px 30px hsl(213, 31%, 11%);
`;

const Header = styled.div`
  display: flex;
  /* background-color: ${V.color.backHard}; */
  padding: 20px;
  font-size: ${V.font.h2};
  justify-content: space-between;
  align-items: center;
  color: ${V.color.front};
`;

const CloseButton = styled.button`
  background-color: ${V.color.frontSoft};
  height: 16px;
  width: 16px;
  mask: url(${timesSvg}) no-repeat center / cover;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${V.color.front};
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 32px;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.p`
  font-size: ${V.font.p};
  margin-top: 0;
  margin-bottom: 8px;
  margin-left: 4px;
  color: ${V.color.frontSoft};
`;

const ErrorMessage = styled.span`
  color: ${V.color.cerise};
`;

const SaveButton = styled(Button)`
  align-self: center;
  margin-bottom: 20px;
  margin-right: 20px;
`;

const networkOptions = [
  { label: 'TOKEL', value: NetworkType.TOKEL },
  { label: 'TKLTEST', value: NetworkType.TKLTEST },
];

const NetworkPrefs = () => {
  const networkPrefs = useSelector(selectNetworkPrefs);
  const [network, setNetwork] = useState(networkPrefs.network);
  const [overrides, setOverrides] = useState(JSON.stringify(networkPrefs.overrides));
  const [settingNetwork, setSettingNetwork] = useState(false);
  const [invalidJson, setInvalidJson] = useState(false);

  const handleOverridesChange = e => {
    const { value } = e.target;
    setOverrides(value);
    try {
      JSON.parse(value);
      setInvalidJson(false);
    } catch {
      setInvalidJson(true);
    }
  };

  const saveNetworkPrefs = () => {
    setSettingNetwork(true);
    const networkPayload = { network, overrides: JSON.parse(overrides) };
    sendToBitgo(BitgoAction.SET_NETWORK, networkPayload);
    dispatch.environment.SET_NETWORK({
      ...networkPayload,
      show: true,
    });
  };

  return (
    <NetworkPrefsRoot>
      <Header>
        Network Preferences
        <CloseButton onClick={() => dispatch.environment.SET_SHOW_NETWORK_PREFS(false)} />
      </Header>
      <Content>
        <Section>
          <Label>Network</Label>
          <Select<NetworkType>
            options={networkOptions}
            defaultValue={networkPrefs.network}
            onSelect={setNetwork}
          />
        </Section>
        <Section>
          <Label>Overrides</Label>
          <TextArea
            height="100px"
            width="100%"
            value={overrides}
            onChange={handleOverridesChange}
            margin="0"
          />
          {invalidJson && <ErrorMessage>Invalid JSON</ErrorMessage>}
        </Section>
      </Content>
      <SaveButton
        theme={Colors.BLACK}
        disabled={invalidJson || settingNetwork}
        onClick={saveNetworkPrefs}
      >
        {settingNetwork ? '...' : 'Save'}
      </SaveButton>
    </NetworkPrefsRoot>
  );
};

export default NetworkPrefs;
