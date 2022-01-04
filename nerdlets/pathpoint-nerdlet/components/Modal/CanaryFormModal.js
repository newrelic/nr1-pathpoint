import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

// IMPORT ICONS
import canary from '../../images/CanaryIconBlack.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

function HeaderCanaryFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={canary} width="18" /> Canary
        </div>
      </div>
    </>
  );
}

function BodyCanaryFormModal(props) {
  const { handleSaveUpdateCanary } = props;
  // const href = messages.button_tools.canary.link_canary;
  // const hrefStyle = {
  //   textDecoration: 'none',
  //   color: 'red'
  // };
  // const unsafePropsCanary = {
  //   href,
  //   target: '_blank',
  //   style: hrefStyle
  // };
  return (
    <div style={{ width: '400px', paddingTop: '20px' }}>
      <form onSubmit={handleSaveUpdateCanary}>
        <div className="modal4content">
          {messages.button_tools.canary.welcome_mat}
        </div>
        <div
          style={{
            float: 'left',
            margin: '20px 15px 0px 0px',
            height: '50px'
          }}
        >
          <span className="touchPointCheckbox">
            <input
              id="checkbox_canary"
              name="checkbox_canary"
              type="Checkbox"
            />
            <label className="checkboxLabel">
              Do not show this message again.
            </label>
          </span>
        </div>
        <div
          style={{
            float: 'right',
            margin: '20px 15px 0px 0px',
            height: '50px'
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ background: '#0178bf', color: 'white' }}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

BodyCanaryFormModal.propTypes = {
  handleSaveUpdateCanary: PropTypes.func.isRequired
};

export { HeaderCanaryFormModal, BodyCanaryFormModal };
