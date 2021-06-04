import React, { ReactElement, useState } from 'react';
import TradingViewWidget, { BarStyles, Themes } from 'react-tradingview-widget';

import styled from '@emotion/styled';

import { Colors } from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';
// import InfoNote from 'components/_General/InfoNote';
import { WidgetContainer } from './common';

const LineGraphRoot = styled(WidgetContainer)`
  grid-column: span 5;
  height: 310px;
  #tradingviewchartKMD {
    background-color: red;
  }
`;

const FrequencyButtons = styled.div`
  float: right;
  button {
    margin-right: 0.5rem;
  }
`;

const GraphHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem 1rem 1.75rem;
  h3 {
    margin: 0;
  }
`;

const frequencies = [
  { fr: '1', name: 'min' },
  { fr: '60', name: 'hour' },
  { fr: 'D', name: 'day' },
  { fr: 'W', name: 'week' },
];

const LineGraph = (): ReactElement => {
  const [frequency, setFrequency] = useState('60');

  return (
    <LineGraphRoot>
      {/* <InfoNote title="Graph functionality is coming  soon" /> */}

      <GraphHeader>
        <h3>TOKEL Chart</h3>
        <FrequencyButtons>
          {frequencies.map(f => (
            <ButtonSmall
              key={f.fr}
              theme={frequency === f.fr ? Colors.PURPLEBORDER : Colors.TRANSPARENT}
              onClick={() => setFrequency(f.fr)}
            >
              {f.name}
            </ButtonSmall>
          ))}
        </FrequencyButtons>
      </GraphHeader>
      <TradingViewWidget
        symbol="KMDUSD"
        theme={Themes.DARK}
        locale="en"
        height={240}
        width={750}
        hide_top_toolbar
        hide_legend
        style={BarStyles.AREA}
        interval={frequency}
        details={false}
      />
    </LineGraphRoot>
  );
};

export default LineGraph;
