import React from 'react';
import { mount } from 'enzyme';
import ShowBody from '../../../components/Modal/ShowBody';
import { it, jest } from '@jest/globals';

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
describe('<ShowBody/>', () => {
  it('Render view modal 0 ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={0}
        stageNameSelected={{
          datos: {
            error_threshold: 1,
            apdex_time: 2
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 1 ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
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
        viewModal={1}
        accountIDs={accountIDs}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 2', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
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
        viewModal={2}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 3', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={3}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 4', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        viewModal={4}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 5', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
        viewModal={5}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 6', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateCanary={jest.fn()}
        viewModal={6}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 7', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateFire={jest.fn()}
        viewModal={7}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 8', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
        viewModal={8}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 9', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        viewModal={9}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 10', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Function handleOnChange ', () => {
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
        viewModal={10}
      />
    );
    bodyRender.instance().handleOnChange({
      target: {
        value: 'sometext',
        name: 'url'
      }
    });
    expect(bodyRender.state('url')).toMatch('sometext');
  });

  it('Function handleSubmitLogo', () => {
    const LogoFormSubmit = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={LogoFormSubmit}
        handleOnChange={jest.fn()}
        viewModal={10}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    bodyRender.instance().handleSubmitLogo({
      preventDefault: jest.fn()
    });
    expect(LogoFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('Function handleSubmitTune', () => {
    const handleSaveUpdateTune = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={jest.fn()}
        _onClose={jest.fn()}
        handleSaveUpdateTune={handleSaveUpdateTune}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    bodyRender.instance().handleSubmitTune({
      preventDefault: jest.fn()
    });
    expect(handleSaveUpdateTune).toHaveBeenCalledTimes(1);
  });

  it('Function handleSubmitSupport', () => {
    const handleSaveUpdateSupport = jest.fn();
    const bodyRender = mount(
      <ShowBody
        handleSaveUpdateSupport={handleSaveUpdateSupport}
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
        stageNameSelected={{
          datos: {
            error_threshold: 0,
            apdex_time: 0
          }
        }}
      />
    );
    bodyRender.instance().handleSubmitSupport({
      preventDefault: jest.fn()
    });
    expect(handleSaveUpdateSupport).toHaveBeenCalledTimes(1);
  });
});
