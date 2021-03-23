import React from 'react';
import { mount } from 'enzyme';
import ShowBody from '../../../components/Modal/ShowBody';
import { it, jest } from '@jest/globals';

describe('<ShowBody/>', () => {
  it('Render view modal 0 ', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={0}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 1 ', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        querySample="simple query"
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
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="Bad query"
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        viewModal={1}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 2', () => {
    const bodyRender = mount(
      <ShowBody
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
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        viewModal={3}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 4', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        viewModal={4}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
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
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 6', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateCanary={jest.fn()}
        viewModal={6}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 7', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        handleSaveUpdateFire={jest.fn()}
        viewModal={7}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 8', () => {
    const bodyRender = mount(
      <ShowBody
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
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 9', () => {
    const bodyRender = mount(
      <ShowBody
        LogoFormSubmit={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        viewModal={9}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 10', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Function handleOnChange ', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
      />
    );
    bodyRender.instance().handleOnChange('input', {
      target: {
        value: 'sometext',
        name: 'url'
      }
    });
    expect(bodyRender.state('url')).toMatch('sometext');
  });

  it('Function handleOnChange with select ', () => {
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
      />
    );
    bodyRender.instance().handleOnChange('select', {
      label: 'sometext'
    });
    expect(bodyRender.state('type')).toMatch('sometext');
  });

  it('Function handleSubmitLogo', () => {
    const LogoFormSubmit = jest.fn();
    const bodyRender = mount(
      <ShowBody
        _onClose={jest.fn()}
        handleSaveUpdateTune={jest.fn()}
        LogoFormSubmit={LogoFormSubmit}
        handleOnChange={jest.fn()}
        viewModal={10}
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
        _onClose={jest.fn()}
        handleSaveUpdateTune={handleSaveUpdateTune}
        LogoFormSubmit={jest.fn()}
        handleOnChange={jest.fn()}
        viewModal={10}
      />
    );
    bodyRender.instance().handleSubmitTune({
      preventDefault: jest.fn()
    });
    expect(handleSaveUpdateTune).toHaveBeenCalledTimes(1);
  });
});
