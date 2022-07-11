import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyQueryFormModal,
  HeaderQueryFormModal
} from '../../../components/Modal/QueryFormModal';

jest.mock('../../../components/Editor/Editor');

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
        stageNameSelected={{
          selectedCase: 0,
          datos: [
            {
              accountID: 2710112,
              timeout: 10,
              query_body: 'SELECT * FROM ApiCall',
              query_footer: 'SINCE 2 DAYS AGO'
            }
          ]
        }}
        accountIDs={accountIDs}
        handleChangeTexarea={jest.fn()}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="GOOD QUERY"
        resultsTestQuery={{ type: 'default' }}
        goodQuery={false}
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
