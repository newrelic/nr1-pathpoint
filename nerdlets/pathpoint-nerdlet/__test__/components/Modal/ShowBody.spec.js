import React from 'react';
import { create } from 'react-test-renderer';
import ShowBody from '../../../components/Modal/ShowBody';

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

describe('ShowBody component', () => {
  test('ShowBody with default data in 0 view', () => {
    const body = create(
      <ShowBody
        handleContinueUAMButton={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        stageNameSelected={{
          selectedCase: 0,
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
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
        testText="Bad query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        viewModal={4}
        width="230px"
        handleSaveUpdateTune={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        accountIDs={accountIDs}
        HandleCredentialsFormChange={jest.fn()}
        handleSaveUpdateGeneralConfiguration={jest.fn()}
        resetCredentials={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });
});
