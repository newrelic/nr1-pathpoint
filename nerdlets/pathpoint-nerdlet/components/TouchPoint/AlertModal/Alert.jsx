/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Utils
import classnames from '../../../utils/classnames';

function Alert({ alertId, onChangeAlert, conditionId, conditionName }) {
  return (
    <div
      role="button"
      onClick={() => {
        if (alertId === conditionId) return; // Not handle event when alert is already actived
        onChangeAlert(conditionId);
      }}
      className={classnames([
        'alert-content',
        alertId === conditionId ? 'active' : null
      ])}
    >
      <span className="title block open-sans">{conditionName}</span>
      <span className="code block open-sans">{conditionId}</span>
    </div>
  );
}

Alert.propTypes = {
  alertId: PropTypes.string.isRequired,
  onChangeAlert: PropTypes.func.isRequired,
  conditionId: PropTypes.string.isRequired,
  conditionName: PropTypes.string.isRequired
};

export default memo(Alert);
