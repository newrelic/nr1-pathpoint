/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Tag from '../../Tag';

// Utils
import { createPriorityStyles } from './utils';

// Images
import globe from '../../../images/globe.svg';

function Incident({
  state,
  priority,
  incidentId,
  incidentLink,
  incidentName,
  createdTime
}) {
  return (
    <div className="incident-content">
      <div className="wrapper">
        <div className="center-inline mb-5 incident-name">
          <img
            src={globe}
            width={14}
            height={14}
            alt="globe"
            className="mt-2 mr-3"
          />

          <span className="open-sans incident-title">{incidentName}</span>
        </div>

        <div className="center-inline">
          <Tag
            value={state}
            color="#828282"
            backgroundColor="rgba(189, 189, 189, 0.4)"
            className="mr-4"
          />

          <Tag
            value={priority}
            className="mr-4"
            {...createPriorityStyles(priority)}
          />

          <span className="mr-4 small incident-time">
            {state} <b>{createdTime}</b>
          </span>

          <a
            href={incidentLink}
            rel="noreferrer"
            target="_blank"
            className="incident-link small"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

Incident.propTypes = {
  state: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  incidentId: PropTypes.string.isRequired,
  incidentLink: PropTypes.string.isRequired,
  incidentName: PropTypes.string.isRequired,
  createdTime: PropTypes.string.isRequired
};

export default memo(Incident);
