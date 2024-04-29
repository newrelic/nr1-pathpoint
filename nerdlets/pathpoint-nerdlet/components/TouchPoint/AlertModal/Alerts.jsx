/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Alert from './Alert';

function Alerts({ alerts, alertId, onChangeAlert }) {
  return (
    <ul className="alert-list">
      {alerts.map(alert => (
        <li key={alert.conditionId} className="alert-item">
          <Alert alertId={alertId} onChangeAlert={onChangeAlert} {...alert} />
        </li>
      ))}
    </ul>
  );
}

Alerts.propTypes = {
  alertId: PropTypes.string.isRequired,
  onChangeAlert: PropTypes.func.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(Alerts, (prevProps, nextProps) => {
  return prevProps.alertId === nextProps.alertId;
});
