import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyTuneFormModal,
  HeaderTuneFormModal
} from '../../../components/Modal/TuneFormModal';

describe('TuneFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyTuneFormModal
        stageNameSelected={{
          selectedCase: {
            value: 0
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
        handleSaveUpdateTune={jest.fn()}
        handleSubmitTune={jest.fn()}
        handleOnChange={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(
      <HeaderTuneFormModal
        stageNameSelected={{
          touchpoint: {
            value: 'touchpoint one'
          },
          selectedCase: {
            value: 0
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
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });
});
