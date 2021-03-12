import React from 'react';
import { mount } from 'enzyme';
import ShowBody from '../../../components/Modal/ShowBody';

describe('<ShowBody/>', () => {
  it('Render view modal 0 ', () => {
    const bodyRender = mount(<ShowBody viewModal={0} />);
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 1 ', () => {
    const bodyRender = mount(
      <ShowBody
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
    const bodyRender = mount(<ShowBody viewModal={3} />);
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
      />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 5', () => {
    const bodyRender = mount(
      <ShowBody handleSaveUpdateSupport={jest.fn()} viewModal={5} />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 6', () => {
    const bodyRender = mount(
      <ShowBody handleSaveUpdateCanary={jest.fn()} viewModal={6} />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 7', () => {
    const bodyRender = mount(
      <ShowBody handleSaveUpdateFire={jest.fn()} viewModal={7} />
    );
    expect(bodyRender.length).toEqual(1);
  });

  it('Render view modal 8', () => {
    const bodyRender = mount(
      <ShowBody
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
        LogoFormSubmit={jest.fn()}
        _onClose={jest.fn()}
        viewModal={10}
      />
    );
    expect(bodyRender.length).toEqual(1);
  });
});
