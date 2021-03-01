import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

// IMPORT ICON
import closeIcon from '../../images/closeIcon.svg';

function ModalWindow(props) {
  const { hidden, OnClose, iframembed } = props;
  const frame = iframembed[0];

  return (
    <Modal show={hidden} onHide={() => OnClose} backdrop="static">
      <Modal.Body style={{ marginTop: '500px ' }}>
        <div
          onClick={() => {
            OnClose();
          }}
          className="closeIcon"
        >
          <img
            style={{
              width: '26px',
              height: '26px',
              zIndex: 5,
              cursor: 'pointer'
            }}
            src={closeIcon}
          />
        </div>
        <div className="wrapper">
          {frame.map(element => {
            return (
              <div key={element} className="box">
                <iframe
                  src={element}
                  style={{
                    display: 'block',
                    height: '400px',
                    width: '600px',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
}

ModalWindow.propTypes = {
  hidden: PropTypes.bool.isRequired,
  OnClose: PropTypes.func.isRequired,
  iframembed: PropTypes.array.isRequired
};

export default ModalWindow;
