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
    const onChange = jest.fn();
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
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
        renderField={onChange}
        handleSaveUpdateTune={jest.fn()}
      />
    );
    expect(bodyRender).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('RenderForm view case PRC', () => {
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
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
        handleSaveUpdateTune={jest.fn()}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('RenderForm view case PCC', () => {
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
        stageNameSelected={{
          selectedCase: {
            value: 0
          },
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
        handleSaveUpdateTune={jest.fn()}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('RenderForm view case FRT', () => {
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
        stageNameSelected={{
          selectedCase: {
            value: 0
          },
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
        handleSaveUpdateTune={jest.fn()}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('RenderForm view case SYN', () => {
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
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
        handleSaveUpdateTune={jest.fn()}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('RenderForm view case APP', () => {
    const bodyRender = mount(
      <BodyTuneFormModal
        handleOnChange={jest.fn()}
        handleSubmitTune={jest.fn()}
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
      />
    );
    expect(bodyRender.length).toEqual(1);
  });
});
