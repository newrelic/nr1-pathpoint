import React from 'react';
import { mount } from 'enzyme';
import {
  BodyTuneFormModal,
  HeaderTuneFormModal
} from '../../../components/Modal/TuneFormModal';

describe('<QueryFormModal/>', () => {
  it('Render body', () => {
    const bodyTuneForm = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
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
      />
    );
    expect(bodyTuneForm.length).toEqual(1);
  });

  it('Render header', () => {
    const headerTuneForm = mount(
      <HeaderTuneFormModal
        handleSubmitTune={jest.fn()}
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
    expect(headerTuneForm.length).toEqual(1);
  });
});
