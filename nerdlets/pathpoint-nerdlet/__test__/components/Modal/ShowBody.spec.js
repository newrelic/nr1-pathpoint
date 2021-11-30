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
        querySample="simple query"
        stageNameSelected={{
          selectedCase: 0,
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
        testText="Bad query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        viewModal={1}
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
