// Hooks
import { useMemo, useState, useCallback } from 'react';

// Utils
import isObject from '../../../utils/isObject';

// Define storage for remember chaned values
const storage = {
  alertId: null,
  issuesId: {}
};

/**
 * Hook that implements the logic of the Alert Modal
 * @param {Object} data Touchpoint data
 * @returns {Object} object
 */
export default function useAlertModal(data) {
  // Define state for active alert, saving the alert id, returned string or null
  const [alertId, setAlertId] = useState(() => {
    // Return saved alertId
    if (typeof storage.alertId === 'string') return storage.alertId;

    if (!isObject(data)) return null; // Data not is a object
    const { alerts } = data; // Get alerts from data

    if (!Array.isArray(alerts)) return null;
    const firstAlert = alerts[0]; // Get first alert

    // Validate first alert
    if (!isObject(firstAlert) || !('conditionId' in firstAlert)) return null;

    // Return 'conditionId'
    return firstAlert.conditionId;
  });

  // Define state for active issue
  const [issueId, setIssueId] = useState(() => {
    const storagedIssueId = storage.issuesId[alertId]; // Get an issue id from storage

    // Return saved issueId
    if (typeof storagedIssueId === 'string') return storagedIssueId;

    if (alertId === null) return null; // Alert id not exists
    if (!isObject(data)) return null; // Data not is a object
    const { alerts } = data; // Get alerts from data

    // Get alert by conditionId
    const alert = alerts.find(alert => alert.conditionId === alertId);

    // Check if alert is valid
    if (typeof alert === 'undefined') return null;

    const issues = alert.issues; // Get issues
    if (!Array.isArray(issues)) return null;
    const firstIssue = issues[0]; // Get first issue

    // Validate first issue
    if (!isObject(firstIssue) || !('issueId' in firstIssue)) return null;

    // Return 'issueId'
    return firstIssue.issueId;
  });

  // Callback for update issue id
  const handleSetIssueId = useCallback(
    id => {
      const { issuesId } = storage; // Get issuesId from storage
      const item = issuesId[alertId]; // Get item saved in issues
      if (item === id) return; // Item and id are equal
      issuesId[alertId] = id; // Update issues id
      setIssueId(id); // Update issue id
    },
    [alertId]
  );

  // Callback for update alert id
  const handleSetAlertId = useCallback(id => {
    const { issuesId } = storage; // Get issues id from storage

    // Update issueId with the saved issue id
    if (typeof issuesId[id] === 'string') {
      setIssueId(issuesId[id]); // Update issue id
      storage.alertId = id; // Save alert id
      return setAlertId(id); // Update alert id
    }

    if (!isObject(data)) return; // Data not is a object
    const { alerts } = data; // Get alerts from data

    // Get the alert by id received
    const alert = alerts.find(alert => alert.conditionId === id);

    if (typeof alert === 'undefined') return; // Alert not exists
    if (!Array.isArray(alert.issues)) return; // Issues are not an array

    const firstIssue = alert.issues[0]; // Get first issue

    // Validate first issue
    if (!isObject(firstIssue) || !('issueId' in firstIssue)) return;

    setIssueId(firstIssue.issueId); // Update issue id
    storage.alertId = id; // Save alert id
    return setAlertId(id); // Update alert id
  }, []);

  // Define state for alerts
  const alertsFormatted = useMemo(() => {
    if (!isObject(data)) return []; // Data not is a object
    const { alerts } = data; // Get alerts from data

    return alerts.map(alert => ({
      conditionId: alert.conditionId,
      conditionName: alert.conditionName
    }));
  }, [data?.alerts]);

  // Get dynamic issues
  const issues = useMemo(() => {
    if (alertId === null) return []; // Alert id not exists
    if (!isObject(data)) return null; // Data not is a object
    const { alerts } = data; // Get alerts from data

    // Get alert by conditionId
    const alert = alerts.find(alert => alert.conditionId === alertId);

    // Check if alert is valid
    if (typeof alert === 'undefined') return [];

    const issues = alert.issues; // Get issues
    if (!Array.isArray(issues)) return [];

    // Return 'issueId'
    return alert.issues;
  }, [alertId]);

  // Excludes incidents from each issue
  const issuesFormatted = useMemo(() => {
    return issues.map(({ incidents, ...issue }) => ({ ...issue }));
  }, [issues]);

  // Get dynamic incidents
  const incidents = useMemo(() => {
    if (typeof issueId !== 'string') return []; // Issue Id not exists

    // Get issue by issueId
    const issue = issues.find(issue => issue.issueId === issueId);

    // Check if issue is valid
    if (typeof issue === 'undefined') return [];

    const incidents = issue.incidents; // Get issues
    if (!Array.isArray(incidents)) return [];
    return incidents; // Get incidents
  }, [issues, issueId]);

  return {
    alertId: alertId,
    issueId: issueId,
    incidents: incidents,
    setAlertId: handleSetAlertId,
    setIssueId: handleSetIssueId,
    alerts: alertsFormatted,
    issues: issuesFormatted
  };
}
