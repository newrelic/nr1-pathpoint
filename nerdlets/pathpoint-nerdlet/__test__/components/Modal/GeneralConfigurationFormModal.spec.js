import React from 'react';
import {
  HeaderGeneralConfigurationFormModal,
  BodyGeneralConfigurationFormModal
} from '../../../components/Modal/GeneralConfigurationFormModal';
import { create } from 'react-test-renderer';

describe('<GeneralConfigurationFormModal/>', () => {
  it('BodyGeneralConfiguration Component', () => {
    const toggleEnableSubmit = jest.fn();
    const component = create(
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
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Render HeaderGeneralConfigurationFormModal', () => {
    const component = create(<HeaderGeneralConfigurationFormModal />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
