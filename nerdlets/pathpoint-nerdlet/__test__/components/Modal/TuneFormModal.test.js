import React from 'react';
import { mount } from 'enzyme';
import {
  BodyTuneFormModal,
  HeaderTuneFormModal
} from '../../../components/Modal/TuneFormModal';
import { jest } from '@jest/globals';

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

  it('Simulate onSubmit', () => {
    const handleSubmitTune = jest.fn();

    const bodyTuneForm = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={handleSubmitTune}
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
    const button = bodyTuneForm.find('button');
    button.simulate('submit');
    expect(handleSubmitTune).toHaveBeenCalledTimes(1);
  });

  it('Simulate onChange of input', () => {
    const handleOnChange = jest.fn();

    const bodyTuneForm = mount(
      <BodyTuneFormModal
        handleOnChange={handleOnChange}
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
    const input = bodyTuneForm.find('input').first();
    const event = { target: { value: 'sometext' } };
    input.simulate('change', event);
    expect(handleOnChange).toHaveBeenCalledTimes(1);
  });
});
