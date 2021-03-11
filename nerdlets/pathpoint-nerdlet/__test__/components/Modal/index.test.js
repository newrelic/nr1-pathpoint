import React from 'react';
import { mount, shallow } from 'enzyme';
import Modal from '../../../components/Modal';

describe('<Modal/>', () => {
  it('Render default values', () => {
    const modal = mount(
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
    expect(modal.length).toEqual(1);
  });

  it('Simulate click in onclose ', () => {
    const onClose = jest.fn();
    const modal = shallow(
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
        _onClose={onClose}
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
    modal.find('div.selectIcon').simulate('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Render default values 3', () => {
    const modal = mount(
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
    expect(modal.length).toEqual(1);
  });
});
