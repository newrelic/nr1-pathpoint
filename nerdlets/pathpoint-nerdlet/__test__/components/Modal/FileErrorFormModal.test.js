import React from 'react';
import { mount } from 'enzyme';
import {
  BodyFileErrorFormModal,
  HeaderFileErrorFormModal
} from '../../../components/Modal/FileErrorFormModal';

describe('<FileErrorFormModal/>', () => {
  it('Render body', () => {
    const bodyFileError = mount(
      <BodyFileErrorFormModal
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
      />
    );
    expect(bodyFileError.length).toEqual(1);
  });

  it('Render header', () => {
    const headerFileError = mount(<HeaderFileErrorFormModal />);
    expect(headerFileError.length).toEqual(1);
  });

  it('TranslateAJVErrors', () => {
    const bodyFileError = mount(
      <BodyFileErrorFormModal
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
      />
    );
    const errors = [
      { dataPath: '/data/0', message: 'message error 1' },
      { dataPath: '/data/1', message: 'message error 2' }
    ];
    const payload = {
      kpis: [
        {
          index: 0,
          type: 101,
          name: 'Unique Visitors',
          shortName: 'Unique',
          queryByCity: [
            {
              accountID: 1606862,
              query:
                'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
              link: 'https://onenr.io/01qwL8KPxw5'
            }
          ],
          value: {
            current: 0,
            previous: 0
          },
          value_type: 'FLOAT',
          prefix: '$',
          suffix: '',
          check: true
        }
      ],
      stages: [
        {
          index: 1,
          title: 'BROWSE',
          arrowMode: 'FLOW',
          percentage_above_avg: 20,
          steps: [
            {
              index: 1,
              id: 'ST1-LINE1-SS1',
              canary_state: false,
              latency: true,
              value: 'Web',
              dark: false,
              history_error: false,
              dotted: false,
              highlighted: false,
              error: false,
              index_stage: 1,
              relationship_touchpoints: [3]
            }
          ]
        }
      ]
    };
    // eslint-disable-next-line no-console
    console.log('bodyFileError', bodyFileError.instance());
  });
});
