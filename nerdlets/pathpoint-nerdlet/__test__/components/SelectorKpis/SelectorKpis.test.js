import React from 'react';
import { mount } from 'enzyme';
import SelectorKpis from '../../../components/SelectorKpis';

describe('<SelectorKpis/>', () => {
  it('Render default', () => {
    const listKpi = [
      {
        index: 0,
        type: 101,
        name: 'Unique Visitors',
        shortName: 'Unique',
        link: 'https://onenr.io/01qwL8KPxw5',
        query:
          'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
        value: {
          current: 0,
          previous: 0
        },
        value_type: 'FLOAT',
        prefix: '$',
        suffix: '',
        check: true
      }
    ];
    const wrapper = mount(
      <SelectorKpis listKpis={listKpi} updateDataKpisChecked={jest.fn()} />
    );
    expect(wrapper.length).toEqual(1);
    wrapper.unmount();
  });

  it('Function handleMenu', () => {
    const updateDataKpisChecked = jest.fn();
    const listKpi = [
      {
        index: 0,
        type: 101,
        name: 'Unique Visitors',
        shortName: 'Unique',
        link: 'https://onenr.io/01qwL8KPxw5',
        query:
          'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
        value: {
          current: 0,
          previous: 0
        },
        value_type: 'FLOAT',
        prefix: '$',
        suffix: '',
        check: true
      }
    ];
    const wrapper = mount(
      <SelectorKpis
        listKpis={listKpi}
        updateDataKpisChecked={updateDataKpisChecked}
      />
    );
    wrapper.instance().handleMenu({ visible: false });
    expect(updateDataKpisChecked).toHaveBeenCalledTimes(0);
    expect(wrapper.state('visible')).toEqual(true);
  });

  it('Function handleCheckKpi()', () => {
    const updateDataKpisChecked = jest.fn();
    const validateQuantityChecksSpy = jest.fn();
    const kpi = {
      index: 0,
      type: 101,
      name: 'Unique Visitors',
      shortName: 'Unique',
      link: 'https://onenr.io/01qwL8KPxw5',
      query:
        'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
      value: {
        current: 0,
        previous: 0
      },
      value_type: 'FLOAT',
      prefix: '$',
      suffix: '',
      check: true
    };
    const listKpi = [
      {
        index: 0,
        type: 101,
        name: 'Unique Visitors',
        shortName: 'Unique',
        link: 'https://onenr.io/01qwL8KPxw5',
        query:
          'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
        value: {
          current: 0,
          previous: 0
        },
        value_type: 'FLOAT',
        prefix: '$',
        suffix: '',
        check: true
      }
    ];
    const wrapper = mount(
      <SelectorKpis
        listKpis={listKpi}
        updateDataKpisChecked={validateQuantityChecksSpy}
      />
    );
    expect(updateDataKpisChecked).toHaveBeenCalledTimes(0);
    const result = wrapper.instance().handleCheckKpi(kpi, {
      validateQuantityChecks: validateQuantityChecksSpy(listKpi)
    });
    // const wrapper2 = wrapper.instance();
    expect(wrapper.props('listKpis')).toEqual({
      listKpis: [
        {
          index: 0,
          type: 101,
          name: 'Unique Visitors',
          shortName: 'Unique',
          link: 'https://onenr.io/01qwL8KPxw5',
          query:
            'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
          value: {
            current: 0,
            previous: 0
          },
          value_type: 'FLOAT',
          prefix: '$',
          suffix: '',
          check: true
        }
      ],
      updateDataKpisChecked: validateQuantityChecksSpy
    });
    expect(result).toEqual(undefined);
    // expect(wrapper2).toEqual(undefined);
  });
});
