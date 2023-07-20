/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Header from './Header';
import Content from './Content';

// Hooks
import useAlertModal from './useAlertModal';
import useClickOutside from './useClickOutside';

function AlertModal({ data, hideModal }) {
  const result = useAlertModal(data); // Execute hook and get the result
  const alertModalRef = useClickOutside(hideModal); // Get ref for the component

  return (
    <div role="dialog">
      <div
        role="dialog"
        tabIndex={-1}
        className="fade in modal block"
        style={{ backgroundColor: 'rgba(51,51,51, 0.25)' }}
      >
        <div id="alert-modal" className="mainModal modal-dialog">
          <div ref={alertModalRef} role="document" className="modal-content">
            <Header
              itemName={data.name}
              totalIssues={data.totalIssues}
              totalIncidents={data.totalIncidents}
              currentTotalIssues={result.issues.length}
              currentTotalIncidents={result.incidents.length}
              hideModal={hideModal}
            />

            <Content {...result} />
          </div>
        </div>
      </div>
    </div>
  );
}

AlertModal.propTypes = {
  data: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default memo(AlertModal, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
