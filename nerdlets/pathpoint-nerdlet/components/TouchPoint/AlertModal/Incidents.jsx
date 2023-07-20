/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Incident from './Incident';

function Incidents({ incidents }) {
  return (
    <ul className="incident-list">
      {incidents.map(incident => (
        <li key={incident.incidentId} className="incident-item">
          <Incident {...incident} />
        </li>
      ))}
    </ul>
  );
}

Incidents.propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(Incidents, (prevProps, nextProps) => {
  return prevProps.incidents === nextProps.incidents;
});
