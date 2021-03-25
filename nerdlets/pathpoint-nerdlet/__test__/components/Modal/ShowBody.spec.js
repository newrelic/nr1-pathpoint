import React from 'react';
import { create } from 'react-test-renderer';
import ShowBody from '../../../components/Modal/ShowBody';

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
        testText="Bad query"
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        viewModal={1}
        handleSaveUpdateTune={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });
});
