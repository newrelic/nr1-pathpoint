/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Issue from './Issue';

function Issues({ issues, issueId, onChangeIssue }) {
  return (
    <ul className="issue-list">
      {issues.map(issue => (
        <li key={issue.issueId} className="issue-item">
          <Issue
            issueActivated={issueId}
            onChangeIssue={onChangeIssue}
            {...issue}
          />
        </li>
      ))}
    </ul>
  );
}

Issues.propTypes = {
  issueId: PropTypes.string.isRequired,
  onChangeIssue: PropTypes.func.isRequired,
  issues: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(Issues, (prevProps, nextProps) => {
  return (
    prevProps.issues === nextProps.issues &&
    prevProps.issueId === nextProps.issueId
  );
});
