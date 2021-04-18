import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import styled from '@emotion/styled';

import copyIcon from 'assets/copy.svg';

const COPIED = 'Copied!';
const IconWrapper = styled.div`
  cursor: pointer;
`;
const ImgClickableWrapper = styled.button`
  background: transparent;
  border: none;
`;

const CopyToClipboard = ({ textToCopy }) => {
  const idRef = useRef(null);

  const copy = () => {
    ReactTooltip.show(idRef.current);
    navigator.clipboard.writeText(String(textToCopy));
  };

  return (
    <IconWrapper onClick={() => copy()}>
      <div data-tip={COPIED} ref={idRef} />
      <ImgClickableWrapper onClick={() => copy()} onKeyDown={() => copy()}>
        <img alt="copy" src={copyIcon} />
      </ImgClickableWrapper>
      <ReactTooltip
        className="react-tooltip"
        event="click"
        eventOff="blur"
        delayShow={100}
        delayHide={1000}
        afterShow={() => ReactTooltip.hide()}
        backgroundColor="#313d4f"
      />
    </IconWrapper>
  );
};

CopyToClipboard.propTypes = {
  textToCopy: PropTypes.string,
};
CopyToClipboard.defaultProps = {
  textToCopy: '',
};
export default CopyToClipboard;
