import React from 'react';
import { mount } from 'enzyme';
import ShowHeader from '../../../components/Modal/ShowHeader';

describe('<ShowHeader/>', () => {
  describe('render view modal 0 ', () => {
    it('icon medal active true', () => {
      const headerRender = mount(
        <ShowHeader
          viewModal={0}
          changeMessage={jest.fn()}
          stageNameSelected={{
            icon_description: 'medal',
            icon_active: true,
            title: 'touchpoint one'
          }}
          accountIDs={{ type: 'default' }}
          changeID={1213212}
        />
      );
      expect(headerRender.length).toEqual(1);
    });

    it('icon medal active false', () => {
      const headerRender = mount(
        <ShowHeader
          viewModal={0}
          changeMessage={jest.fn()}
          stageNameSelected={{
            icon_description: 'medal',
            icon_active: false,
            title: 'touchpoint one'
          }}
          accountIDs={{ type: 'default' }}
          changeID={1213212}
        />
      );
      expect(headerRender.length).toEqual(1);
    });

    it('icon start active true', () => {
      const headerRender = mount(
        <ShowHeader
          viewModal={0}
          changeMessage={jest.fn()}
          stageNameSelected={{
            icon_description: 'start',
            icon_active: false,
            title: 'touchpoint one'
          }}
          accountIDs={{ type: 'default' }}
          changeID={1213212}
        />
      );
      expect(headerRender.length).toEqual(1);
    });

    it('icon start active false', () => {
      const headerRender = mount(
        <ShowHeader
          viewModal={0}
          changeMessage={jest.fn()}
          stageNameSelected={{
            icon_description: 'start',
            icon_active: false,
            title: 'touchpoint one'
          }}
          accountIDs={{ type: 'default' }}
          changeID={1213212}
        />
      );
      expect(headerRender.length).toEqual(1);
    });
  });

  it('render view modal 1', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
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
        viewModal={1}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 2', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
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
        viewModal={2}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 3', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{
          touchpoint: {
            value: 'touchpoint one'
          }
        }}
        viewModal={3}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 4', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={4}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 5', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={5}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 6', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={6}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 7', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={7}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 8', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={8}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 9', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={9}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });

  it('render view modal 10', () => {
    const headerRender = mount(
      <ShowHeader
        changeMessage={jest.fn()}
        stageNameSelected={{}}
        viewModal={10}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(headerRender.length).toEqual(1);
  });
});
