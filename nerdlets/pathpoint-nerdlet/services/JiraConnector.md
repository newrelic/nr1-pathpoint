# Introduction

This service has been created to connect the support form with the Jira tickets using the Jira REST API (https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/) and proxy to preserve security parameters

## Use Cases

The main reason to use the Jira REST API is create a custom support ticket inside a Jira Project using the application support form

## Authorization

All API requests require the use of a generated Access Token. You can generate your own Access Token using the Jira Basic Authentication Doc (https://developer.atlassian.com/server/jira/platform/basic-authentication/)


## Usage

```http
POST https://proxy.pathpoint-support.workers.dev/?https://jira.wigilabs.workers.dev/
```
| Header | Value |
| :--- | :--- |
| `contentType` | **Required**. application/json |
| `Authorization` | **Required**. Jira Access Token |

| Body | Type | Description |
| :--- | :--- | :--- |
| `data` | `object` | **Required**. Your Jira |

## Data Structure

This is structure you need to use to send the data in body when you call the Jira Rest API

```http
const data = {
    fields: {
      summary: `Ticket Summary`,
      priority: {
        name: 'Low | Medium | High'
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
                text: `Some description`
              }
            ]
          },
        ]
      },
      project: {
        key: 'PTS (Put here the key of your Jira Project)'
      },
      issuetype: {
        name: 'Support (Put here the name of your Jira custom field)'
      }
    }
  };
```

## Status Codes

Jira REST API returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 401 | `UNAUTHORIZED` |
| 500 | `INTERNAL SERVER ERROR` |

