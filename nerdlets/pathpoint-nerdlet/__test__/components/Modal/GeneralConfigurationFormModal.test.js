import React from 'react';
import { shallow } from 'enzyme';
import {
  HeaderGeneralConfigurationFormModal,
  BodyGeneralConfigurationFormModal
} from '../../../components/Modal/GeneralConfigurationFormModal';

describe('<GeneralConfigurationFormModal/>', () => {
  it('Render HeaderGeneralConfigurationFormModal', () => {
    const component = shallow(<HeaderGeneralConfigurationFormModal />);
    expect(component.exists()).toBe(true);
  });

  it('Render BodyGeneralConfigurationFormModal', () => {
    const toggleEnableSubmit = jest.fn();

    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={jest.fn()}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={toggleEnableSubmit}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    expect(component.exists()).toBe(true);
  });

  it('Render BodyGeneralConfigurationFormModal with ToggleEnableSubmit on onFocus', () => {
    const toggleEnableSubmit = jest.fn();
    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={jest.fn()}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={toggleEnableSubmit}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    const FormControl = component.find('FormControl').at(0);
    FormControl.simulate('focus', toggleEnableSubmit);
    const FormControl2 = component.find('FormControl').at(1);
    FormControl2.simulate('focus', toggleEnableSubmit);
    expect(toggleEnableSubmit).toHaveBeenCalledTimes(2);
  });

  it('Render BodyGeneralConfigurationFormModal with Formcontrol on onCopy', () => {
    const toggleEnableSubmit = jest.fn();
    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={jest.fn()}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={toggleEnableSubmit}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    const FormControl = component.find('FormControl').at(0);
    const e = { preventDefault: jest.fn() };
    FormControl.simulate('copy', e);
    const FormControl2 = component.find('FormControl').at(1);
    FormControl2.simulate('copy', e);
    expect(component.exists()).toBe(true);
  });

  it('Render BodyGeneralConfigurationFormModal with Formcontrol on onBlur', () => {
    const toggleEnableSubmit = jest.fn();
    const validateUserApiKey = jest.fn();
    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={jest.fn()}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={validateUserApiKey}
        ToggleEnableSubmit={toggleEnableSubmit}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    const FormControl = component.find('FormControl').at(0);
    const e = { target: { value: 'someFunction' } };
    FormControl.simulate('blur', e);
    const FormControl2 = component.find('FormControl').at(1);
    FormControl2.simulate('blur', e);
    expect(component.exists()).toBe(true);
    expect(toggleEnableSubmit).toHaveBeenCalledTimes(2);
    expect(validateUserApiKey).toHaveBeenCalledTimes(1);
  });

  it('Render BodyGeneralConfigurationFormModal with Formcontrol on onChange', () => {
    const toggleEnableSubmit = jest.fn();
    const validateUserApiKey = jest.fn();
    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={jest.fn()}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={validateUserApiKey}
        ToggleEnableSubmit={toggleEnableSubmit}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    const FormControl = component.find('FormControl').at(0);
    const e = { target: { value: 'someFunction' } };
    FormControl.simulate('change', e);
    const FormControl2 = component.find('FormControl').at(1);
    FormControl2.simulate('change', e);
    expect(component.exists()).toBe(true);
  });

  it('Render BodyGeneralConfigurationFormModal with input handleOnChange', () => {
    const handleOnChange = jest.fn();
    const component = shallow(
      <BodyGeneralConfigurationFormModal
        stageNameSelected={{
          datos: {
            credentials: {
              accountId: 2710112,
              flameTools: true,
              updateBackgroundScript: true
            },
            accountIDs: [2710112, 2710113]
          }
        }}
        handleOnChange={handleOnChange}
        handleFormSubmit={jest.fn()}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        licenseValidations={{ ingestLicense: false, userApiKey: false }}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        installUpdateBackgroundScripts={jest.fn()}
      />
    );
    const FormControl = component.find('input').at(0);
    const e = { target: { checked: true } };
    FormControl.simulate('change', e);
    const FormControl2 = component.find('input').at(1);
    FormControl2.simulate('change', e);
    expect(component.exists()).toBe(true);
  });
});
