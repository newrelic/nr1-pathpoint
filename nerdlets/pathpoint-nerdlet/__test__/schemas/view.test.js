import { CustomSchemaValidation } from '../../schemas/view';

describe('view schemas', () => {
  const stages = [
    {
      title: 'BROWSE',
      active_dotted: 'none',
      steps: [
        {
          line: 1,
          values: [
            {
              title: 'Web',
              id: 'ABCDE'
            }
          ]
        },
        {
          line: 2,
          values: [
            {
              title: 'Login',
              id: 'ST1-LINE2-SS1'
            }
          ]
        },
        {
          line: 3,
          values: [
            {
              title: 'Search',
              id: 'ST1-LINE3-SS1'
            }
          ]
        },
        {
          line: 4,
          values: [
            {
              title: 'Rewards',
              id: 'ST1-LINE4-SS1'
            }
          ]
        }
      ],
      touchpoints: [
        {
          title: 'Touchpoint browse',
          status_on_off: true,
          dashboard_url: ['https://one.newrelic.com'],
          related_steps: 'ST1-LINE4-SS1',
          queries: [
            {
              type: 'COUNT-QUERY',
              query: "SELECT count(*) from Transaction WHERE appName='QS'"
            },
            {
              type: 'ERROR-PERCENTAGE-QUERY',
              query:
                "SELECT percentage(count(*), WHERE error is true) as percentage from Transaction WHERE appName='QS'"
            },
            {
              type: 'APDEX-QUERY',
              query:
                "SELECT apdex(duration, t:2) FROM Transaction WHERE appName='QS'"
            },
            {
              type: 'SESSIONS-QUERY',
              query:
                "SELECT uniqueCount(session) as session FROM PageView WHERE appName='QS'"
            }
          ]
        }
      ]
    },
    {
      title: 'BAG',
      active_dotted: 'dotted',
      steps: [
        {
          line: 1,
          values: [
            {
              title: 'Pay Items',
              id: 'ST2-LINE1-SS1'
            },
            {
              title: 'Reward Items',
              id: 'ST2-LINE1-SS2'
            }
          ]
        },
        {
          line: 2,
          values: [
            {
              title: 'Add/Remove Item',
              id: 'ST2-LINE2-SS1'
            }
          ]
        },
        {
          line: 3,
          values: [
            {
              title: 'PAY Calculation',
              id: 'ST2-LINE3-SS1'
            },
            {
              title: 'POINTS Calculation',
              id: 'ST2-LINE3-SS2'
            }
          ]
        },
        {
          line: 4,
          values: [
            {
              title: 'Checkout',
              id: 'ST2-LINE4-SS1'
            }
          ]
        }
      ],
      touchpoints: [
        {
          title: 'Touchpoint bag one',
          status_on_off: true,
          dashboard_url: ['https://one.newrelic.com'],
          related_steps: 'ST2-LINE4-SS1',
          queries: [
            {
              type: 'COUNT-QUERY',
              query:
                "SELECT count(*) from Transaction WHERE appName='productCatalog-service' AND name='WebTransaction/Go/hipstershop.ProductCatalogService/GetProduct'"
            },
            {
              type: 'ERROR-PERCENTAGE-QUERY',
              query:
                "SELECT percentage(count(*), WHERE error is true) as percentage from Transaction WHERE appName='productCatalog-service' AND name='WebTransaction/Go/hipstershop.ProductCatalogService/GetProduct'"
            },
            {
              type: 'APDEX-QUERY',
              query:
                "SELECT apdex(duration, t:0.5) FROM Transaction WHERE appName='productCatalog-service' AND name='WebTransaction/Go/hipstershop.ProductCatalogService/GetProduct'"
            },
            {
              type: 'SESSIONS-QUERY',
              query: ''
            }
          ]
        },
        {
          title: 'Touchpoint bag two',
          status_on_off: true,
          dashboard_url: ['https://one.newrelic.com'],
          related_steps: 'ST2-LINE2-SS1',
          queries: [
            {
              type: 'COUNT-QUERY',
              query:
                "SELECT count(*) FROM Transaction WHERE appName='frontend-service' AND name='WebTransaction/Go/GET /cart'"
            },
            {
              type: 'ERROR-PERCENTAGE-QUERY',
              query:
                "SELECT percentage(count(*), WHERE error is true) as percentage FROM Transaction WHERE appName='frontend-service' AND name='WebTransaction/Go/GET /cart'"
            },
            {
              type: 'APDEX-QUERY',
              query:
                "SELECT apdex(duration, t:0.5) FROM Transaction WHERE appName='email-service'"
            },
            {
              type: 'SESSIONS-QUERY',
              query: ''
            }
          ]
        }
      ]
    }
  ];
  it('stages correct structure', () => {
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(!result).toBeFalsy();
  });

  it('Wrong version', () => {
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '99999999'
    });
    expect(result.length).toEqual(1);
  });

  it('stages wrong dashboard_url', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://google.com'];
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(result.length).toEqual(1);
  });

  it('stages wrong related_steps', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://one.newrelic.com'];
    stages[0].touchpoints[0].related_steps = '123';
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(result.length).toEqual(2);
  });

  it('stages wrong query touchpoint', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://one.newrelic.com'];
    stages[0].touchpoints[0].related_steps = 'ST1-LINE4-SS1';
    stages[0].touchpoints[0].queries[0].type = 'COUNT-QUERY`';
    stages[0].touchpoints[0].queries[1].type = 'ERROR-PERCENTAGE-QUERY~';
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(result.length).toEqual(3);
  });

  it('stages wrong step consecutive', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://one.newrelic.com'];
    stages[0].touchpoints[0].related_steps = 'ST1-LINE4-SS1';
    stages[0].touchpoints[0].queries[0].type = 'COUNT-QUERY';
    stages[0].touchpoints[0].queries[1].type = 'ERROR-PERCENTAGE-QUERY';
    stages[0].steps[1].line = 9;
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(result.length).toEqual(2);
  });

  it('stages wrong id step', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://one.newrelic.com'];
    stages[0].touchpoints[0].related_steps = 'ST1-LINE4-SS1';
    stages[0].touchpoints[0].queries[0].type = 'COUNT-QUERY';
    stages[0].touchpoints[0].queries[1].type = 'ERROR-PERCENTAGE-QUERY';
    stages[0].steps[1].line = 2;
    stages[0].steps[1].values[0].id = 'ABCDE';
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.2.0'
    });
    expect(result.length).toEqual(2);
  });

  it('stages wrong dashboard_url with no includes http', () => {
    stages[0].touchpoints[0].dashboard_url = ['://google.com'];
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.0.0'
    });
    expect(result.length).toEqual(3);
  });

  it('error return false', () => {
    stages[0].touchpoints[0].dashboard_url = ['https://google.com'];
    stages[0].touchpoints[0].related_steps = '';
    stages[0].steps = [
      {
        line: 1,
        values: [
          {
            title: 'Web',
            id: 'ST1-LINE2-SS1'
          }
        ]
      }
    ];
    const result = CustomSchemaValidation({
      stages: stages,
      pathpointVersion: '1.5.8'
    });
    expect(result).toEqual(false);
  });
});
