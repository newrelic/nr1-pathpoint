import { shallow } from 'enzyme';
import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyJsonConfigurationFormModal,
  HeaderJsonConfigurationFormModal
} from '../../../components/Modal/JsonConfigurationFormModal';

describe('JsonConfigurationFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
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
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render body with default data and do functions', () => {
    const onClose = jest.fn().mockReturnValue(true);
    const validateKpiQuery = { query: 'SELECT *FROM Transaction' };
    const SetConfigurationJSON = jest.fn().mockReturnValue(true);
    const component = shallow(
      <BodyJsonConfigurationFormModal
        _onClose={onClose}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={SetConfigurationJSON}
        validateKpiQuery={validateKpiQuery}
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
    expect(component.exists()).toBe(true);
  });

  test('Render header with default data', () => {
    const header = create(<HeaderJsonConfigurationFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
