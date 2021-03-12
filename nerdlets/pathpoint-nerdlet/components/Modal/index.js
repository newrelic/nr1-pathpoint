import React from 'react';
import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';

// IMPORT ICONS
import closeIcon from '../../images/closeIcon.svg';

// IMPORT COMPONENTS
import ShowBody from './ShowBody';
import ShowHeader from './ShowHeader';

const Modal = props => {
  const { _onClose, hidden } = props;
  return (
    <BootstrapModal
      dialogClassName="mainModal"
      show={hidden}
      onHide={/* istanbul ignore next */ () => _onClose()}
    >
      <BootstrapModal.Header>
        <div className="headerModal">
          <ShowHeader {...props} />
          <div className="selectIcon" onClick={() => _onClose()}>
            <img className="mainModal__closeIcon" src={closeIcon} />
          </div>
        </div>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <div className="containModal">
          <ShowBody {...props} />
        </div>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;

Modal.propTypes = {
  hidden: PropTypes.bool.isRequired,
  _onClose: PropTypes.func.isRequired
};
