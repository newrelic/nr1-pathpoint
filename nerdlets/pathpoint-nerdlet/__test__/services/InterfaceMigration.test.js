import InterfaceMigration from '../../services/InterfaceMigration';

describe('InterfaceEditor', () => {
  let interfaceMigration;

  beforeEach(() => {
    interfaceMigration = new InterfaceMigration(2710112);
  });

  it('Function MigrateStagesInterface()', async () => {
    const stagesInterface = [
      {
        id: 2710,
        index: 1,
        oldIndex: 1,
        title: 'Login User',
        type: 'PCC',
        active_dotted: 'none',
        arrowMode: 'FLOW',
        visible: true,
        new: true,
        steps: [
          {
            id: 11,
            value: 'new',
            visible: true,
            sub_steps: [
              {
                index: 1,
                value: 'Sub_step',
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          {
            index: 1,
            name: 'touchpint'
          }
        ]
      }
    ];
    const data = {
      stages: []
    };
    const interfaceEdit = interfaceMigration.MigrateStagesInterface(
      stagesInterface,
      data
    );
    expect(interfaceEdit).toEqual({
      stages: [
        {
          title: 'Login User',
          type: 'PCC',
          active_dotted: 'none',
          arrowMode: 'FLOW',
          steps: [
            {
              line: 1,
              values: [
                {
                  id: 'ST1-LINE1-SS1',
                  title: 'Sub_step'
                }
              ]
            }
          ],
          touchpoints: []
        }
      ]
    });
  });

  it('Function GetStageTouchpoints()', async () => {
    const steps = [
      {
        id: 11,
        value: 'new',
        visible: true,
        sub_steps: [
          {
            index: 1,
            value: 'Sub_step'
          }
        ]
      }
    ];
    const gui_touchpoints = [
      {
        id: 1,
        index: 1,
        visible: true,
        oldIndex: 1,
        title: 'Touchpoint Login',
        dashboard_url: 'https://owner.io',
        subs: ['new sub'],
        queryData: {
          query: 'SELECT * FROM Transaction'
        },
        status_on_off: true
      }
    ];
    interfaceMigration.SetDashboard_url = jest
      .fn()
      .mockReturnValue('SELECT * FROM Transaction');
    interfaceMigration.SetRelatedSteps = jest.fn().mockReturnValue([3, 2]);
    interfaceMigration.SetTouchpointQueries = jest
      .fn()
      .mockReturnValue('SELECT * FROM Transaction');
    const interfaceEdit = interfaceMigration.GetStageTouchpoints(
      steps,
      gui_touchpoints
    );
    expect(interfaceEdit).toEqual([
      {
        dashboard_url: 'SELECT * FROM Transaction',
        queries: 'SELECT * FROM Transaction',
        related_steps: [3, 2],
        status_on_off: true,
        title: 'Touchpoint Login'
      }
    ]);
  });

  it('Function SetDashboard_url()', () => {
    const url = 'https://owner.io';
    expect(interfaceMigration.SetDashboard_url(url)).toEqual([url]);
  });

  it('Function SetDashboard_url() with url = vacio', () => {
    const url = '';
    expect(interfaceMigration.SetDashboard_url(url)).toEqual(false);
  });

  it('Function SetRelatedSteps()', () => {
    const subs = ['step_tittle', 'step_second_title'];
    const steps = [
      {
        values: [
          {
            title: 'step_tittle',
            id: 1
          },
          {
            title: 'step_second_title',
            id: 2
          }
        ]
      }
    ];
    expect(interfaceMigration.SetRelatedSteps(subs, steps)).toEqual('1,2');
  });

  it('Function SetTouchpointQueries()', () => {
    const queryDataPersonCount = {
      type: 'Person-Count',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_count: 1.3,
      max_count: 5
    };
    const queryDataProcessCount = {
      type: 'Process-Count',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_count: 1.3,
      max_count: 5
    };
    const queryDataAPICount = {
      type: 'API-Count',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_count: 1.3,
      max_count: 5
    };
    const queryDataApplicationPerformance = {
      type: 'Application-Performance',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_apdex: 1.3,
      max_response_time: 5,
      max_error_percentage: 19
    };
    const queryDataFrontEndPerformance = {
      type: 'FrontEnd-Performance',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_apdex: 1.3,
      max_response_time: 5,
      max_error_percentage: 19
    };
    const queryDataAPIPerformance = {
      type: 'API-Performance',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_apdex: 1.3,
      max_response_time: 5,
      max_error_percentage: 19
    };
    const queryDataSyntheticsCheck = {
      type: 'Synthetics-Check',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      max_avg_response_time: 1.3,
      max_total_check_time: 5,
      min_success_percentage: 2
    };
    const queryDataAPIStatus = {
      type: 'API-Status',
      accountID: 2710113,
      query: 'SELECT * FROM Transaction',
      query_timeout: 0.1,
      measure_time: 0.25,
      min_success_percentage: 2
    };
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataPersonCount)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'Person-Count',
        max_count: 5,
        min_count: 1.3
      }
    ]);
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataProcessCount)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'Process-Count',
        max_count: 5,
        min_count: 1.3
      }
    ]);
    expect(interfaceMigration.SetTouchpointQueries(queryDataAPICount)).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'API-Count',
        max_count: 5,
        min_count: 1.3
      }
    ]);
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataApplicationPerformance)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'Application-Performance',
        min_apdex: 1.3,
        max_response_time: 5,
        max_error_percentage: 19
      }
    ]);
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataFrontEndPerformance)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'FrontEnd-Performance',
        min_apdex: 1.3,
        max_response_time: 5,
        max_error_percentage: 19
      }
    ]);
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataAPIPerformance)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'API-Performance',
        min_apdex: 1.3,
        max_response_time: 5,
        max_error_percentage: 19
      }
    ]);
    expect(
      interfaceMigration.SetTouchpointQueries(queryDataSyntheticsCheck)
    ).toEqual([
      {
        accountID: 2710113,
        measure_time: 0.25,
        query: 'SELECT * FROM Transaction',
        query_timeout: 0.1,
        type: 'Synthetics-Check',
        max_avg_response_time: 1.3,
        max_total_check_time: 5,
        min_success_percentage: 2
      }
    ]);
    expect(interfaceMigration.SetTouchpointQueries(queryDataAPIStatus)).toEqual(
      [
        {
          accountID: 2710113,
          measure_time: 0.25,
          query: 'SELECT * FROM Transaction',
          query_timeout: 0.1,
          type: 'API-Status',
          min_success_percentage: 2
        }
      ]
    );
  });
});
