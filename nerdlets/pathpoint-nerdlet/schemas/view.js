// IMPORT LIBRARIES
import appPackage from '../../../package.json';

// EXPORT SCHEMA
export default {
  type: 'object',
  required: ['stages', 'pathpointVersion', 'kpis'],
  properties: {
    pathpointVersion: {
      type: 'string'
    },
    kpis: {
      type: 'array',
      minItems: 2,
      maxItems: 50,
      additionalItems: true,
      items: [
        {
          type: 'object',
          required: ['index', 'type', 'name', 'shortName', 'link', 'query', 'value', 'check'],
          properties: {
            index: {
              type: 'number'
            },
            type: {
              type: 'number',
              minimum: 100,
              maximum: 101
            },
            name: {
              type: 'string'
            },
            shortName: {
              type: 'string'
            },
            link: {
              type: 'string'
            },
            query: {
              type: 'string'
            },
            value: {
              type: ['number','object']
            },
            check: {
              type: 'boolean'
            }
          }
        }
      ]
    },
    stages: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      additionalItems: true,
      items: [
        {
          type: 'object',
          required: ['title', 'active_dotted', 'steps'],
          properties: {
            title: {
              type: 'string'
            },
            active_dotted: {
              type: 'string',
              enum: ['none', 'dotted']
            },
            steps: {
              type: 'array',
              minItems: 1,
              maxItems: 5,
              additionalItems: true,
              items: [
                {
                  type: 'object',
                  required: ['line', 'values'],
                  properties: {
                    line: {
                      type: 'number',
                      minimum: 1,
                      maximum: 5
                    },
                    values: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 5,
                      additionalItems: true,
                      items: [
                        {
                          type: 'object',
                          required: ['title', 'id'],
                          properties: {
                            title: {
                              type: 'string'
                            },
                            id: {
                              type: 'string'
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            },
            touchpoints: {
              type: 'array',
              minItems: 1,
              maxItems: 200,
              additionalItems: true,
              items: [
                {
                  type: 'object',
                  required: [
                    'title',
                    'status_on_off',
                    'dashboard_url',
                    'related_steps',
                    'queries'
                  ],
                  properties: {
                    title: {
                      type: 'string'
                    },
                    status_on_off: {
                      type: 'boolean'
                    },
                    dashboard_url: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 1,
                      items: {
                        type: ['string', 'boolean']
                      }
                    },
                    related_steps: {
                      type: 'string'
                    },
                    queries: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 200,
                      additionalItems: true,
                      items: [
                        {
                          type: 'object',
                          required: ['type'],
                          properties: {
                            type: {
                              type: 'string'
                            },
                            query: {
                              type: 'string'
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
};

export const CustomSchemaValidation = target => {
  let errors = [];
  const ids = [];
  target.stages.forEach((stage, c) => {
    let counter = stage.steps[0].line;
    stage.steps.forEach((step, i) => {
      if (i > 0) {
        if (counter + 1 === step.line) {
          counter += 1;
        } else {
          errors.push({
            dataPath: `stages/${c}/steps/${i}/line`,
            message: 'Line must be consecutive'
          });
          counter += 1;
        }
      }
      step.values.forEach((value, x) => {
        let finded = false;
        ids.forEach(id => {
          if (id === value.id) {
            finded = true;
            errors.push({
              dataPath: `stages/${c}/steps/${i}/values/${x}/id`,
              message: 'This ID already exist'
            });
          }
        });
        if (!finded) {
          ids.push(value.id);
        }
      });
    });
  });
  target.stages.forEach((stage, i) => {
    stage.touchpoints.forEach((touchpoint, c) => {
      if (
        touchpoint.dashboard_url[0] !== false &&
        !touchpoint.dashboard_url[0].includes('https://one.newrelic.com') &&
        !touchpoint.dashboard_url[0].includes('https://one.nr')
      ) {
        errors.push({
          dataPath: `stages/${i}/touchpoints/${c}/dashboard_url/0`,
          message: `URL must match with new relic domain`
        });
      }
      if (touchpoint.related_steps !== '') {
        const related_steps = touchpoint.related_steps.split(',');
        related_steps.forEach(related => {
          let finded = false;
          ids.forEach(id => {
            if (id === related.trim()) {
              finded = true;
            }
          });
          if (!finded) {
            errors.push({
              dataPath: `stages/${i}/touchpoints/${c}/related_steps`,
              message: `ID doesn't exist`
            });
          }
        });
      }
      const regex = new RegExp('^[A-Za-z0-9_-]*$');
      touchpoint.queries.forEach((query, x) => {
        if (!regex.test(query.type)) {
          errors.push({
            dataPath: `stages/${i}/touchpoints/${c}/queries/${x}/type`,
            message: `Type must only contains letters, numbers, dashes and underscores`
          });
        }
      });
    });
  });
  const currentVersion = appPackage.version.split('.');
  const targetVersion = target.pathpointVersion.split('.');
  if (
    currentVersion[0] !== targetVersion[0] ||
    currentVersion[1] !== targetVersion[1]
  ) {
    errors.push({
      dataPath: `pathpointVersion`,
      message: `The version you attemp upload is not compatible with the application`
    });
  }
  if (errors.length === 0) {
    errors = false;
  }
  return errors;
};
