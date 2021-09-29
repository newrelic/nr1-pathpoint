import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyQueryFormModal,
  HeaderQueryFormModal
} from '../../../components/Modal/QueryFormModal';

const accountIDs = [
  {
    name: 'WigiBoards',
    id: 2710112
  }
];
describe('QueryFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyQueryFormModal
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
        testText="Bad query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(
      <HeaderQueryFormModal
        stageNameSelected={{
          touchpoint: {
            value: 'Test API'
          },
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
        changeMessage={jest.fn()}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });
});
