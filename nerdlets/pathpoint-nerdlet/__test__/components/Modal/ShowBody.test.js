import React from 'react';
import { mount } from 'enzyme';
import ShowBody from '../../../components/Modal/ShowBody';
import { it, jest } from '@jest/globals';

const accountIDs = [
  {
    name: 'WigiBoards',
    id: 2710112
  },
  {
    name: 'Account 2',
    id: 7859641
  },
  {
    name: 'Account 3',
    id: 7859642
  },
  {
    name: 'Account 4',
    id: 7859642
  }
];
describe('<ShowBody/>', () => {
  it('Render view modal 0 ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={0}
        width="230px"
        stageNameSelected={{
          selectedCase: {
            value: 0
          },
          datos: [
            {
              type: 'PRC',
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='us-east-1'",
              min_count: 36,
              session_count: 0,
              accountID: 2904070
            }
          ]
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 1 ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        querySample="simple query"
        stageNameSelected={{
          selectedCase: 0,
          datos: [
            {
              type: 'PCC',
              query:
                "SELECT count(*) FROM Public_APICall WHERE awsRegion='us-east-1'",
              min_count: 20,
              transaction_count: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="Bad query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        viewModal={1}
        width="230px"
        accountIDs={accountIDs}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 2', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        stageNameSelected={{
          selectedCase: {
            value: 0
          },
          datos: [
            {
              type: 'APP',
              query:
                "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='QS'",
              min_apdex: 0.4,
              max_response_time: 0.5,
              max_error_percentage: 5,
              apdex_value: 0,
              response_value: 0,
              error_percentage: 0
            }
          ]
        }}
        handleSaveUpdateTune={jest.fn()}
        viewModal={2}
        width="230px"
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 3', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={3}
        width="230px"
        stageNameSelected={{
          selectedCase: 0,
          datos: [
            {
              type: 'FRT',
              query:
                "SELECT filter(apdex(duration, t:1), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from PageView WHERE appName='QS'",
              min_apdex: 0.6,
              max_response_time: 1.2,
              max_error_percentage: 5,
              apdex_value: 0,
              response_value: 0,
              error_percentage: 0
            }
          ]
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 4', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        viewModal={4}
        width="230px"
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        stageNameSelected={{
          selectedCase: {
            value: 0
          },
          datos: [
            {
              type: 'SYN',
              query:
                "SELECT filter(percentage(count(result),WHERE result='SUCCESS'),WHERE 1=1) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticCheck,SyntheticRequest WHERE monitorName='BDB Live person'",
              max_avg_response_time: 0.7,
              max_total_check_time: 1.25,
              min_success_percentage: 98,
              success_percentage: 0,
              max_duration: 0,
              max_request_time: 0
            }
          ]
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 5', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
        viewModal={5}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 6', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateCanary={jest.fn()}
        viewModal={6}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 7', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateFire={jest.fn()}
        viewModal={7}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 8', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
        viewModal={8}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 9', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        viewModal={9}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0,
            credentials: {
              accountId: 2710112
            },
            accountIDs: [2710112]
          }
        }}
        credentialsData={{ credentialsData: { ingestLicense: 'INGEST' } }}
        licenseValidations={{
          licenseValidations: {
            ingestLicense: false
          }
        }}
        options={{ options: ['options'] }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 10', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Function handleOnChange ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        viewModal={10}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    bodyRender.instance().handleOnChange({
      target: {
        value: 'sometext',
        name: 'url'
      }
    });
    expect(bodyRender.state('url')).toMatch('sometext');
  });

  it('Function handleSubmitLogo', () => {
    const LogoFormSubmit = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={LogoFormSubmit}
        handleOnChange={jest.fn()}
        viewModal={10}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    bodyRender.instance().handleSubmitLogo({
      preventDefault: jest.fn()
    });
    expect(LogoFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('Function handleSubmitTune', () => {
    const handleSaveUpdateTune = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={handleSaveUpdateTune}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    bodyRender.instance().handleSubmitTune({
      preventDefault: jest.fn()
    });
    expect(handleSaveUpdateTune).toHaveBeenCalledTimes(1);
  });

  it('Function handleSubmitSupport', () => {
    const handleSaveUpdateSupport = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={handleSaveUpdateSupport}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        width="230px"
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
        ValidateIngestLicense={jest.fn()}
        ValidateUserApiKey={jest.fn()}
        ToggleEnableSubmit={jest.fn()}
        installUpdateBackgroundScripts={jest.fn()}
        disableGeneralConfigurationSubmit={false}
        credentialsData={{
          accountId: null,
          ingestLicense: null,
          userAPIKey: null,
          dropTools: null,
          flameTools: null,
          loggin: null
        }}
        licenseValidations={{
          ingestLicense: false,
          userApiKey: false
        }}
      />
    );
    bodyRender.instance().handleSubmitSupport({
      preventDefault: jest.fn()
    });
    expect(handleSaveUpdateSupport).toHaveBeenCalledTimes(1);
  });
});
