/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Components
import Tag from '../../Tag';

// Hooks
import useIssue from './useIssue';

// Utils
import classnames from '../../../utils/classnames';

function Issue({
  status,
  issueActivated,
  issueId,
  onChangeIssue,
  priority,
  issueName,
  issueLink,
  activatedDate,
  activatedTime
}) {
  const {
    clock,
    blackClock,
    isActive,
    tagStyles,
    handleMouseEnter,
    handleMouseLeave
  } = useIssue({
    issueId: issueId,
    priority: priority,
    issueActivated: issueActivated
  });

  return (
    <button
      type="button"
      onMouseEnter={isActive ? undefined : handleMouseEnter}
      onMouseLeave={isActive ? undefined : handleMouseLeave}
      className={classnames(['issue-content', isActive ? 'active' : null])}
      onClick={() => {
        if (isActive) return; // Not handle event when issue is already actived
        onChangeIssue(issueId);
      }}
    >
      <div className="flex justify-between mb-3">
        <div className="flex">
          <Tag
            value={priority}
            className={classnames(['mr-4', priority.toLowerCase()])}
            backgroundColor={tagStyles.backgroundColor}
            color={tagStyles.color}
          />

          <span className="small issue-description open-sans">
            Issue <b className="status">{status}</b> on {activatedDate}
          </span>
        </div>

        <span className="small clock">
          <img alt="clock" src={isActive ? blackClock : clock} />{' '}
          {activatedTime}
        </span>
      </div>

      <span className="issue-name block">{issueName}</span>

      <a
        href={issueLink}
        rel="noreferrer"
        target="_blank"
        className="issue-link inline-flex small"
      >
        Dashboard
      </a>
    </button>
  );
}

Issue.propTypes = {
  status: PropTypes.string.isRequired,
  issueActivated: PropTypes.string.isRequired,
  onChangeIssue: PropTypes.func.isRequired,
  issueId: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  issueName: PropTypes.string.isRequired,
  issueLink: PropTypes.string.isRequired,
  activatedDate: PropTypes.string.isRequired,
  activatedTime: PropTypes.string.isRequired
};

export default memo(Issue);
