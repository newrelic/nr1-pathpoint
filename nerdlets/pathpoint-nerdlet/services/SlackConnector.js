import axios from 'axios';
import env from '../../../.env.json';

/**
 * Method that sends a file to a Slack channel with the logs obtained in the Fetch
 * @param {Array} logs logs saved from Datadog fetch process
 * @param {number} accountId New Relic account ID
 */

async function sendLogsSlack(logs, accountId, title) {
  const jsonLogs = {};
  for (let index = 0; index < logs.length; index++) {
    jsonLogs[index] = logs[index];
  }
  const finalLogs = JSON.stringify(jsonLogs, replaceErrors, 2);
  const fileLog = new Blob([finalLogs], { type: 'application/json' });
  const data = new FormData();
  data.append('file', fileLog, 'FileTest.json');
  data.append('initial_comment', `${title}: accountId(${accountId})`);
  data.append('channels', '#pathpoint-logs');
  const proxyUrl = 'https://long-meadow-1713.rsamanez.workers.dev/?';
  const options = {
    url: `${proxyUrl}https://slack.com/api/files.upload`,
    method: 'POST',
    headers: {
      Authorization: env.SlackAccessToken,
      contentType: 'application/json'
    },
    data: data
  };
  await axios(options)
    .then(result => {
      if (!result.data.ok) {
        // TO-DO
      }
    })
    .catch(error => {
      throw new Error(error);
      // TO-DO
    });
}
function replaceErrors(key, value) {
  if (value instanceof Error) {
    const error = {};
    Object.getOwnPropertyNames(value).forEach(function(key) {
      error[key] = value[key];
    });
    return error;
  }
  return value;
}

export { sendLogsSlack };
