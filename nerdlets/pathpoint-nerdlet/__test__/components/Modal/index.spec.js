import React from 'react';
import { create } from 'react-test-renderer';
import Modal from '../../../components/Modal';

describe('Modal component', () => {
  test('Modal with default data', () => {
    const modal = create(
      <Modal
        updateNewGui={jest.fn()}
        errorsList={[]}
        configuration={null}
        hidden={false}
        stageNameSelected=""
        viewModal={0}
        querySample=""
        testText=""
        goodQuery
        _onClose={jest.fn()}
        changeMessage={jest.fn()}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleChangeTexarea={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        supportForm={{
          subject: '',
          name: '',
          email: '',
          phone: '',
          message: ''
        }}
        handleChangeTexareaSupport={jest.fn()}
        changeSubject={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
        handleSaveUpdateCanary={jest.fn()}
        handleSaveUpdateFire={jest.fn()}
        LogoFormSubmit={jest.fn()}
        validateKpiQuery={{}}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        modifiedQuery={false}
      />
    );
    expect(modal.toJSON()).toMatchSnapshot();
  });
});
