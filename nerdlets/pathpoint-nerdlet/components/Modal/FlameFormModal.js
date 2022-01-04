import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';

// IMPORT ICONS
import flame from '../../images/flame_icon.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

function HeaderFlameFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={flame} height="15" width="15" /> Flame
        </div>
      </div>
    </>
  );
}

function BodyFlameFormModal(props) {
  const { handleSaveUpdateFire } = props;
  // const href = messages.button_tools.flame.link_flame;
  // const hrefStyle = {
  //   textDecoration: 'none',
  //   color: 'red'
  // };
  // const unsafeProps = {
  //   href,
  //   target: '_blank',
  //   style: hrefStyle
  // };
  return (
    <div style={{ width: '400px', paddingTop: '20px' }}>
      <form onSubmit={handleSaveUpdateFire}>
        <div className="modal4content">
          <> {ReactHtmlParser(messages.button_tools.flame.welcome_mat)} </>
        </div>
        <div
          style={{
            float: 'left',
            margin: '20px 15px 0px 0px',
            height: '50px'
          }}
        >
          <span className="touchPointCheckbox">
            <input id="checkbox_fire" name="checkbox_fire" type="Checkbox" />
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

BodyFlameFormModal.propTypes = {
  handleSaveUpdateFire: PropTypes.func.isRequired
};

export { HeaderFlameFormModal, BodyFlameFormModal };
