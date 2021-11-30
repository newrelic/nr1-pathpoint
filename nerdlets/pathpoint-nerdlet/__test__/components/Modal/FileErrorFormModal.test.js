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
    expect(bodyFileError.instance()).toEqual(null);
  });
});
