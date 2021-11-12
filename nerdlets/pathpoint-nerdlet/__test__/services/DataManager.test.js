import DataManager from '../../services/DataManager';
import appPackage from '../../../../package.json';

jest.mock('nr1', () => {
  const AccountsQuery = {
    query: jest.fn().mockReturnValue({
      data: [{ id: 2710112, name: 'WigiBoards' }]
    })
  };
  const AccountStorageQuery = {
    query: jest
      .fn()
      .mockImplementation(({ accountId, collection, documentId }) => {
        switch (collection) {
          case 'pathpoint': {
            switch (documentId) {
              case 'version':
                return { data: { Version: '1.0.0' } };
              case 'newViewJSON':
                return {
                  data: {
                    kpis: [
                      {
                        check: true,
                        index: 0,
                        link: 'https://onenr.io/01qwL8KPxw5',
                        name: 'Unique Visitors',
                        prefix: '$',
                        queryByCity: [],
                        shortName: 'Unique',
                        value_type: 'FLOAT'
                      }
                    ],
                    ViewJSON: [
                      {
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'people'
                      },
                      {
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'traffic'
                      }
                    ]
                  }
                };
              case 'dataCanary':
                return { data: { dataCanary: [{}, {}] } };
              case 'touchpoints':
                return {
                  data: {
                    TouchPoints: [
                      {
                        index: 0,
                        country: 'PRODUCTION',
                        touchpoints: [
                          {
                            stage_index: 1,
                            status_on_off: true,
                            touchpoint_index: 1,
                            value: 'Login People (PRC)',
                            measure_points: [
                              {
                                measure_time: '15 minutes ago',
                                min_count: 10,
                                query:
                                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                                session_count: 17699,
                                timeout: 10,
                                type: 'PRC'
                              }
                            ],
                            relation_steps: [4]
                          }
                        ]
                      }
                    ]
                  }
                };
              case 'DropParams':
                return { data: { dataCanary: [{}, {}] } };
              case 'HistoricErrorsParams':
                return {
                  data: {
                    historicErrorsDays: 0,
                    historicErrorsHighLightPercentage: 0
                  }
                };
            }
            break;
          }
        }
        return accountId;
      })
  };
  const NerdGraphQuery = {
    query: jest.fn().mockImplementation(async ({ query }) => {
      if (query.includes('BAD REQUEST')) {
        const errors = [];
        await new Promise((resolve, reject) => {
          errors.push('Unexpected query');
          return reject(errors);
        });
      }
    })
  };
});
