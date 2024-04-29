/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Alerts from './Alerts';
import Issues from './Issues';
import Incidents from './Incidents';

function Content({
  alerts,
  alertId,
  setAlertId,
  issues,
  issueId,
  setIssueId,
  incidents
}) {
  return (
    <div className="content">
      <section className="section alerts">
        <Alerts alertId={alertId} alerts={alerts} onChangeAlert={setAlertId} />
      </section>

      <section className="section issues">
        <Issues issueId={issueId} issues={issues} onChangeIssue={setIssueId} />
      </section>

      <section className="section incidents">
        <Incidents incidents={incidents} />
      </section>
    </div>
  );
}

Content.propTypes = {
  alertId: PropTypes.string.isRequired,
  issueId: PropTypes.string.isRequired,
  setAlertId: PropTypes.func.isRequired,
  setIssueId: PropTypes.func.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  issues: PropTypes.arrayOf(PropTypes.object).isRequired,
  incidents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(Content, (prevProps, nextProps) => {
  return (
    prevProps.alerts === nextProps.alerts &&
    prevProps.issues === nextProps.alerts &&
    prevProps.alertId === nextProps.alertId &&
    prevProps.issueId === nextProps.issueId &&
    prevProps.incidents === nextProps.incidents
  );
});
