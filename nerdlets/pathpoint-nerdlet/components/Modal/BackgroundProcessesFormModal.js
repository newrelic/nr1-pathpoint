import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import DownloadLink from 'react-download-link';

// IMPORT ICONS
import setup from '../../images/setup.svg';
import down from '../../images/down.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

function HeaderBackgroundProcessesFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={setup} width="18" /> Setup: Background Processes
        </div>
      </div>
    </>
  );
}

function BodyBackgroundProcessesFormModal(props) {
  const { GetCurrentHistoricErrorScript, _onClose } = props;
  const href = messages.configuration.setup.json_link_demo;
  const hrefStyle = {
    textDecoration: 'none',
    color: 'red'
  };
  const unsafeProps = {
    href,
    target: '_blank',
    style: hrefStyle
  };
  return (
    <div
      style={{
        width: '400px',
        height: '500px',
        paddingTop: '20px',
        display: 'grid',
        gridTemplate: '55% 30% / 1fr'
      }}
    >
      <div className="modal4content" style={{ textAlign: 'justify' }}>
        {ReactHtmlParser(messages.configuration.setup.background)}
        <div>
          <a {...unsafeProps}>Click here</a>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          paddingRight: '15px',
          paddingLeft: '15px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly'
        }}
      >
        <div>
          <img src={down} height="15" width="24" />
          <DownloadLink
            label="Fire filter"
            filename="FireSyntheticFilter.js"
            className="downloadLink"
            style={{ cursor: 'pointer' }}
            exportFile={
              /* istanbul ignore next */ () =>
                getFireSyntheticFilter(GetCurrentHistoricErrorScript, _onClose)
            }
          />
        </div>
      </div>
    </div>
  );
}

function getFireSyntheticFilter(cb, onClose) {
  onClose();
  return cb();
}

BodyBackgroundProcessesFormModal.propTypes = {
  _onClose: PropTypes.func.isRequired,
  GetCurrentHistoricErrorScript: PropTypes.func.isRequired
};

export {
  HeaderBackgroundProcessesFormModal,
  BodyBackgroundProcessesFormModal,
  getFireSyntheticFilter
};
