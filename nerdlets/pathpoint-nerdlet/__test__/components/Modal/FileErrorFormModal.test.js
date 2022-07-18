import React from 'react';
import { mount, shallow } from 'enzyme';
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

  it('Render body with change handleUploadJSONFile', () => {
    const handleUploadJSONFile = jest.fn();
    const UpdateOldTouchpointName = jest.fn();
    const bodyFileError = shallow(
      <BodyFileErrorFormModal
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
        handleUploadJSONFile={handleUploadJSONFile}
        UpdateOldTouchpointName={UpdateOldTouchpointName}
      />
    );
    const e = new Blob();
    const change = {
      target: { files: [e] },
      _onClose: jest.fn(),
      validateKpiQuery: {},
      SetConfigurationJSON: jest.fn()
    };
    bodyFileError
      .find('#file-upload')
      .at(0)
      .simulate('change', change);
    expect(handleUploadJSONFile).toHaveBeenCalledTimes(0);
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
