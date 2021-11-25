import React from 'react';
import { mount, shallow } from 'enzyme';
import Header, {
  transformK,
  FormatMoney,
  RenderLogo,
  PrintKPI
} from '../../../components/Header/Header';

jest.mock(
  'nr1',
  () => {
    const window = {
      open: jest.fn()
    };
    const Icon = {
      TYPE: {
        HARDWARE_AND_SOFTWARE__SOFTWARE__LOGS:
          'hardware-and-software--software--logs'
      }
    };
    return {
      window,
      Icon: Icon
    };
  },
  { virtual: true }
);

const credentials = {
  login: true
};
const kpis = [
  {
    index: 0,
    type: 101,
    name: 'Unique Visitors',
    shortName: 'Unique',
    link:
      'https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true',
    query: 'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago',
    value: {
      current: 0,
      previous: 0
    },
    check: true
  },
  {
    index: 1,
    type: 101,
    name: '1 Account',
    shortName: '1 Acc.',
    link:
      'https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true',
    query: 'SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago',
    value: {
      current: 0,
      previous: 0
    },
    check: false
  }
];
describe('<Header/>', () => {
  describe('Mount component', () => {
    it('Banner kpis initial', () => {
      const header = mount(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          // type={Icon}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      expect(header.length).toEqual(1);
    });

    it('Simulate click activeSixthSenseIcon', () => {
      const activeSixthSenseIcon = jest.fn();
      const header = shallow(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={activeSixthSenseIcon}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      const clickHeader = header.find('.fireIconContainer').at(0);
      clickHeader.simulate('click');
      expect(activeSixthSenseIcon).toHaveBeenCalledTimes(1);
    });

    it('Simulate click toggleHeaderButtons with flame status', () => {
      const handleAddToCart = jest.fn();
      const header = mount(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={handleAddToCart}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      header
        .find('.fireIconContainer')
        .at(1)
        .simulate('click');
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
    });

    it('Simulate click toggleHeaderButtons with canary status', () => {
      const handleAddToCart = jest.fn();
      const header = mount(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={handleAddToCart}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      header
        .find('.fireIconContainer')
        .at(2)
        .simulate('click');
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
    });

    it('Simulate click toggleHeaderButtons with gout status', () => {
      const handleAddToCart = jest.fn();
      const header = mount(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={handleAddToCart}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      header
        .find('.fireIconContainer')
        .at(0)
        .simulate('click');
      expect(handleAddToCart).toHaveBeenCalledTimes(0);
    });

    it('Kpi click to open link', () => {
      const header = mount(
        <Header
          iconSixthSenseStatus={false}
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus={false}
          iconFireStatus={false}
          iconStartStatus={false}
          changeTimeRange={jest.fn()}
          iconGoutStatus={false}
          showLeftPanel={false}
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      const filterKpis = jest.fn();
      header.find('.kpicontent').simulate('click');
      expect(filterKpis).toHaveBeenCalledTimes(0);
    });
    it('Banner kpis change order and values boolean', () => {
      const header = mount(
        <Header
          iconSixthSenseStatus={false}
          activeSixthSenseIcon={jest.fn()}
          iconCanaryStatus={false}
          iconFireStatus={false}
          iconStartStatus={false}
          changeTimeRange={jest.fn()}
          iconGoutStatus={false}
          showLeftPanel={false}
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
          credentials={credentials}
          accountId={2710112}
        />
      );
      expect(header.length).toEqual(1);
    });
  });

  describe('Function FormatMoney', () => {
    it('Positive quantity', () => {
      const result = FormatMoney(1000);
      expect(result).toMatch('$1,000.00');
    });

    it('Negative quantity', () => {
      const result = FormatMoney(-1000);
      expect(result).toMatch('$1,000.00');
    });

    it('Nan value', () => {
      const decimalCount = 0 / 'one';
      const result = FormatMoney(-1000, jest.fn(), decimalCount);
      expect(result).toMatch('$1,000.00');
    });

    it('no value', () => {
      const result = FormatMoney({});
      expect(result).toMatch('$0.00');
    });

    it('incorrect value', () => {
      const amount = [];
      const decimalCount = false;
      const DisplayConsole = jest.fn();
      const result = FormatMoney(amount, DisplayConsole, decimalCount);
      expect(result).toMatch('$0');
      DisplayConsole('error', 'Error Message');
    });
  });

  describe('Function RenderLogo', () => {
    it('Logo type default', () => {
      const logo = {
        type: 'default'
      };
      const result = RenderLogo(logo);
      expect(result).toEqual(
        <div className="logo-container">
          <img src={{}} />
        </div>
      );
    });

    it('Logo type text', () => {
      const logo = {
        type: 'text',
        text: 'myLogo'
      };
      const result = RenderLogo(logo);
      expect(result).toEqual(
        <div className="logo-text-container">
          <p>myLogo</p>
        </div>
      );
    });

    it('Logo type url', () => {
      const logo = {
        type: 'url',
        url: 'myawesomeimage.png'
      };
      const result = RenderLogo(logo);
      expect(result).toEqual(
        <div className="logo-container">
          <img src="myawesomeimage.png" />
        </div>
      );
    });
  });
  describe('Function transformK', () => {
    it('Type is float', () => {
      const value = 10000;
      const type = 'FLOAT';
      const result = transformK(value, type);
      expect(result).toEqual('10 K');
    });
    it('Value is higher than 1000000', () => {
      const value = 1000001;
      const result = transformK(value);
      expect(result).toEqual('1 M');
    });
    it('Value is higher than 1000', () => {
      const value = 1001;
      const result = transformK(value);
      expect(result).toEqual('1 K');
    });
    it('Value is less than 1000', () => {
      const value = 100;
      const result = transformK(value);
      expect(result).toEqual('100');
    });
  });

  describe('Function PrintKPI', () => {
    it('kpi = 100', () => {
      const kpi = {
        index: 0,
        type: 100,
        name: 'Unique Visitors',
        shortName: 'Unique',
        link:
          'https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true',
        query:
          'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago',
        value: {
          current: 0,
          previous: 0
        },
        check: true
      };
      const result = PrintKPI(kpi);
      expect(result).toBeTruthy();
    });
  });
  it('kpi = 101', () => {
    const kpi = {
      index: 0,
      type: 101,
      name: 'Unique Visitors',
      shortName: 'Unique',
      link:
        'https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true',
      query:
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago',
      value: {
        current: 0,
        previous: 0
      },
      check: true
    };
    const result = PrintKPI(kpi);
    expect(result).toBeTruthy();
  });

  it('kpi = 102', () => {
    const kpi = {
      index: 0,
      type: 102,
      name: 'Unique Visitors',
      shortName: 'Unique',
      link:
        'https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true',
      query:
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago',
      value: {
        current: 0,
        previous: 0
      },
      check: true
    };
    const result = PrintKPI(kpi);
    expect(result).toBeTruthy();
  });
});
