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
      minItems: 0,
      maxItems: 50,
      additionalItems: true,
      items: [
        {
          type: 'object',
          required: [
            'type',
            'name',
            'shortName',
            'measure',
            'value_type',
            'prefix',
            'suffix'
          ],
          properties: {
            type: {
              type: 'number',
              enum: [100, 101]
            },
            name: {
              type: 'string'
            },
            shortName: {
              type: 'string'
            },
            measure: {
              type: 'array',
              minItems: 0,
              maxItems: 20,
              additionalItems: true,
              items: [
                {
                  type: 'object',
                  required: ['accountID', 'query', 'link'],
                  properties: {
                    accountID: {
                      type: 'number'
                    },
                    query: {
                      type: 'string'
                    },
                    link: {
                      type: 'string'
                    }
                  }
                }
              ]
            },
            value_type: {
              type: 'string',
              enum: ['INT', 'FLOAT']
            },
            prefix: {
              type: 'string'
            },
            suffix: {
              type: 'string'
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
                          required: ['type', 'query', 'accountID'],
                          properties: {
                            type: {
                              type: 'string'
                            },
                            query: {
                              type: 'string'
                            },
                            accountID: {
                              type: 'number'
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
            dataPath: `The stage '${stage.title}', in step at position ${i + 1}, `,
            message: `the property 'line' must be consecutive`
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
              dataPath: `The stage '${stage.title}', in step at position ${i + 1}, in substep at position ${x + 1}, `,
              message: `the following id '${id}' already exist`
            });
          }
        });
        if (!finded) {
          ids.push(value.id);
        }
      });
    });
  });
  target.stages.forEach(stage => {
    stage.touchpoints.forEach(touchpoint => {
      if (
        touchpoint.dashboard_url[0] !== false &&
        !touchpoint.dashboard_url[0].includes('https://')
      ) {
        errors.push({
          dataPath: `The stage '${stage.title}', in touchpoint ${touchpoint.title}, in dashboard_url at position 1, `,
          message: `the URL must match with new relic domain`
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
              dataPath: `The stage ${stage.title}, in touchpoint ${touchpoint.title}, in property 'related_steps, '`,
              message: `the following id '${related}' doesn't exist`
            });
          }
        });
      }
      const regex = new RegExp('^[A-Za-z0-9_-]*$');
      touchpoint.queries.forEach((query, x) => {
        if (!regex.test(query.type)) {
          errors.push({
            dataPath: `The stage ${stage.title}, in touchpoint ${
              touchpoint.title
            }, in query at position ${x + 1}, in property 'type', `,
            message: `must only contains letters, numbers, dashes and underscores`
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
      dataPath: `Error in the property 'pathpointVersion', `,
      message: `the version you attemp upload is not compatible with the application`
    });
  }
  if (errors.length === 0) {
    errors = false;
  }
  return errors;
};
