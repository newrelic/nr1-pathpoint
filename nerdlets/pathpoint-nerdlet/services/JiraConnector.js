// IMPORT LIBRARIES
import axios from 'axios';
import env from '../../../.env.json';

export const CreateJiraIssue = (datos, accountId) => {
  const instance = axios.create();
  const data = {
    fields: {
      summary: `${datos.name} - ${datos.company}`,
      priority: {
        name: 'Low'
      },
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Subject: ${datos.subject}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Account ID: ${accountId}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Name: ${datos.name}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Company: ${datos.company}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Account Name: ${datos.account}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Email: ${datos.email}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Mobile: ${datos.phone}`
              }
            ]
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Details: ${datos.message}`
              }
            ]
          }
        ]
      },
      project: {
        key: 'PTS'
      },
      issuetype: {
        name: 'Support'
      }
    }
  };
  instance.post(env.proxyJira, data, {
    headers: {
      contentType: 'application/json',
      Authorization: env.JiraAccessToken
    }
  });
};
