import React from 'react';
import { mount } from 'enzyme';
import {
  BodyJsonConfigurationFormModal,
  HeaderJsonConfigurationFormModal,
  GoToDocumentation,
  HandleFromFileClick,
  TranslateAJVErrors,
  HandleDownload
} from '../../../components/Modal/JsonConfigurationFormModal';

const payload = {
  pathpointVersion: '',
  kpis: [
    {
      type: 101,
      name: 'Unique Visitors',
      shortName: 'Unique',
      measure: [
        {
          accountID: 1606862,
          query:
            'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
          link: 'https://onenr.io/01qwL8KPxw5'
        }
      ],
      value_type: 'FLOAT',
      prefix: '$',
      suffix: ''
    }
  ],
  stages: [
    {
      title: 'BROWSE',
      active_dotted: 'none',
      arrowMode: 'FLOW',
      steps: [
        {
          line: 1,
          values: [
            {
              title: 'Web',
              id: 'ST1-LINE1-SS1'
            },
            {
              title: 'Mobile Web',
              id: 'ST1-LINE1-SS2'
            },
            {
              title: 'App',
              id: 'ST1-LINE1-SS3'
            }
          ]
        }
      ],
      touchpoints: [
        {
          title: 'Login People (PRC)',
          status_on_off: true,
          dashboard_url: ['https://onenr.io/01qwL8KPxw5'],
          related_steps: 'ST1-LINE2-SS1',
          queries: [
            {
              type: 'PRC-COUNT-QUERY',
              accountID: 1,
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
              query_timeout: 10,
              min_count: 10,
              max_count: 110,
              measure_time: '15 minutes ago'
            }
          ]
        }
      ]
    }
  ]
};

describe('<FileErrorFormModal/>', () => {
  beforeAll(() => {
    delete window.open;
    window.open = jest.fn();
  });

  it('Render body', () => {
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 0,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    expect(bodyJsonConfiguration.length).toEqual(1);
  });

  it('Render body with jsonMetaData', () => {
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: 'Testing',
          note: 'Testing'
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 0,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    expect(bodyJsonConfiguration.length).toEqual(1);
  });

  it('Render body with view 1', () => {
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 1,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    expect(bodyJsonConfiguration.length).toEqual(1);
  });

  it('Render body with view 1 and historic', () => {
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 1,
          historic: [
            {
              jsonMetaData: {
                date: new Date(),
                description: ''
              }
            }
          ]
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    expect(bodyJsonConfiguration.length).toEqual(1);
  });

  it('Render header', () => {
    const headerJsonConfiguration = mount(<HeaderJsonConfigurationFormModal />);
    expect(headerJsonConfiguration.length).toEqual(1);
  });

  it('HandleFromFileClick', () => {
    const input = document.createElement('input');
    input.setAttribute('id', 'file-upload');
    document.body.appendChild(input);
    HandleFromFileClick();
  });

  it('HandleDownload', () => {
    const input = document.createElement('input');
    input.setAttribute('class', 'downloadLink');
    document.body.appendChild(input);
    HandleDownload();
  });

  it('GoToDocumentation', () => {
    GoToDocumentation();
  });

  it('Emulate click go to documentation', () => {
    const testQuery = jest.fn();
    const headerJsonConfiguration = mount(<HeaderJsonConfigurationFormModal />);
    headerJsonConfiguration
      .find('.titleModal img')
      .at(1)
      .simulate('click');
    expect(testQuery).toHaveBeenCalledTimes(0);
  });

  it('Emulate on change note', () => {
    const testQuery = jest.fn();
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 0,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    bodyJsonConfiguration
      .find('.text-input-custom')
      .at(0)
      .simulate('change');
    expect(testQuery).toHaveBeenCalledTimes(0);
  });

  it('Emulate upload click', () => {
    const testQuery = jest.fn();
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 0,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    bodyJsonConfiguration
      .find('#upload-file-submit button')
      .at(0)
      .simulate('click');
    expect(testQuery).toHaveBeenCalledTimes(0);
  });

  it('Emulate on change description', () => {
    const testQuery = jest.fn();
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        UpdateJSONMetaData={jest.fn()}
        jsonMetaData={{
          description: '',
          note: ''
        }}
        GetHistoricJSONData={jest.fn().mockReturnValue([])}
        JSONModal={{
          view: 0,
          historic: []
        }}
        UpdateItemSelectFromHistoric={jest.fn()}
        currentHistoricSelected={null}
        RestoreJSONFromHistoric={jest.fn()}
        username="PathPoint"
      />
    );
    bodyJsonConfiguration
      .find('.text-input-custom')
      .at(1)
      .simulate('change');
    expect(testQuery).toHaveBeenCalledTimes(0);
  });

  it('Emulate click download', () => {
    const testQuery = jest.fn();
    const headerJsonConfiguration = mount(<HeaderJsonConfigurationFormModal />);
    headerJsonConfiguration
      .find('.container_header_icons div')
      .at(0)
      .simulate('click');
    expect(testQuery).toHaveBeenCalledTimes(0);
  });

  it('TranslateAJVErrors with level 0', () => {
    const errors = [
      {
        dataPath: '',
        message: ''
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 1', () => {
    const errors = [
      {
        dataPath: '/',
        message: '',
        params: {
          missingProperty: ''
        }
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 2', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '',
        schemaPath: '#/required',
        params: {
          missingProperty: 'pathpointVersion'
        },
        message: "should have required property 'pathpointVersion'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 3', () => {
    const errors = [
      {
        keyword: 'type',
        dataPath: '/pathpointVersion',
        schemaPath: '#/properties/pathpointVersion/type',
        params: {
          type: 'string'
        },
        message: 'should be string'
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 4', () => {
    const errors = [
      {
        keyword: 'enum',
        dataPath: '/kpis/0/type',
        schemaPath: '#/properties/kpis/items/0/properties/type/enum',
        params: {
          allowedValues: [100, 101]
        },
        message: 'should be equal to one of the allowed values'
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 5', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/kpis/0',
        schemaPath: '#/properties/kpis/items/0/required',
        params: {
          missingProperty: 'name'
        },
        message: "should have required property 'name'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 6', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/kpis/0',
        schemaPath: '#/properties/kpis/items/0/required',
        params: {
          missingProperty: 'shortName'
        },
        message: "should have required property 'shortName'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 7', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0',
        schemaPath: '#/properties/stages/items/0/required',
        params: {
          missingProperty: 'title'
        },
        message: "should have required property 'title'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 8', () => {
    const errors = [
      {
        keyword: 'enum',
        dataPath: '/stages/0/active_dotted',
        schemaPath: '#/properties/stages/items/0/properties/active_dotted/enum',
        params: {
          allowedValues: ['none', 'dotted']
        },
        message: 'should be equal to one of the allowed values'
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 9', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/steps/0',
        schemaPath:
          '#/properties/stages/items/0/properties/steps/items/0/required',
        params: {
          missingProperty: 'line'
        },
        message: "should have required property 'line'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 10', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/steps/0/values/0',
        schemaPath:
          '#/properties/stages/items/0/properties/steps/items/0/properties/values/items/0/required',
        params: {
          missingProperty: 'title'
        },
        message: "should have required property 'title'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 11', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/touchpoints/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/required',
        params: {
          missingProperty: 'title'
        },
        message: "should have required property 'title'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 12', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/touchpoints/0/queries/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 13', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/measure/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, payload);
  });

  it('TranslateAJVErrors with level 14', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/touchpoints/0/dashboard_url/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      stages: [
        {
          touchpoints: [
            {
              dashboard_url: []
            }
          ]
        }
      ]
    });
  });
  it('TranslateAJVErrors with level 15', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/steps/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      stages: [
        {
          steps: [{}],
          touchpoints: [
            {
              dashboard_url: []
            }
          ]
        }
      ]
    });
  });

  it('TranslateAJVErrors with level 16', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/steps/0/values/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      stages: [
        {
          steps: [
            {
              line: 0,
              values: [
                {
                  name: ''
                }
              ]
            }
          ],
          touchpoints: [
            {
              dashboard_url: []
            }
          ]
        }
      ]
    });
  });

  it('TranslateAJVErrors with level 17', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/kpis/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      kpis: [
        {
          shortName: ''
        }
      ],
      stages: [
        {
          steps: [
            {
              line: 0,
              values: [
                {
                  name: ''
                }
              ]
            }
          ],
          touchpoints: [
            {
              dashboard_url: []
            }
          ]
        }
      ]
    });
  });

  it('TranslateAJVErrors with level 18', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/touchpoints/0/dashboard_url/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      stages: [
        {
          touchpoints: [
            {
              dashboard_url: ['']
            }
          ]
        }
      ]
    });
  });

  it('TranslateAJVErrors with level 19', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '/stages/0/touchpoints/0/queries/0',
        schemaPath:
          '#/properties/stages/items/0/properties/touchpoints/items/0/properties/queries/items/0/required',
        params: {
          missingProperty: 'type'
        },
        message: "should have required property 'type'"
      }
    ];
    TranslateAJVErrors(errors, {
      stages: [
        {
          touchpoints: [
            {
              queries: [{}],
              dashboard_url: ['']
            }
          ]
        }
      ]
    });
  });
});
