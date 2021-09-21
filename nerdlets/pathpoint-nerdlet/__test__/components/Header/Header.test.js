import React from 'react';
import { mount } from 'enzyme';
import Header, {
  FormatMoney,
  RenderLogo
} from '../../../components/Header/Header';

describe('<Header/>', () => {
  describe('Mount component', () => {
    it('Banner kpis initial', () => {
      const banner_kpis = [
        {
          type: 100,
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Total Order Value',
          prefix: '$',
          suffix: '',
          query:
            'SELECT count(*) as value FROM Transaction SINCE 5 minutes AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Max Duration',
          prefix: '',
          suffix: '',
          query:
            'SELECT max(duration) as value FROM Transaction SINCE 30 minutes AGO',
          value: 0
        }
      ];
      const kpis = [
        {
          index: 0,
          type: 101,
          name: "Unique Visitors",
          shortName: "Unique",
          link: "https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: true
        },
        {
          index: 1,
          type: 101,
          name: "1 Account",
          shortName: "1 Acc.",
          link: "https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: false
        }
      ];
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
          // ---- quitar este atributo
          banner_kpis={banner_kpis}
          // --------------------------
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0,
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
        />
      );
      expect(header.length).toEqual(1);
    });

    it('Simulate click activeSixthSenseIcon', () => {
      const handleAddToCart = jest.fn();
      const banner_kpis = [
        {
          type: 100,
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Total Order Value',
          prefix: '$',
          suffix: '',
          query:
            'SELECT count(*) as value FROM Transaction SINCE 5 minutes AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Max Duration',
          prefix: '',
          suffix: '',
          query:
            'SELECT max(duration) as value FROM Transaction SINCE 30 minutes AGO',
          value: 0
        }
      ];
      const kpis = [
        {
          index: 0,
          type: 101,
          name: "Unique Visitors",
          shortName: "Unique",
          link: "https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: true
        },
        {
          index: 1,
          type: 101,
          name: "1 Account",
          shortName: "1 Acc.",
          link: "https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: false
        }
      ];
      const header = mount(
        <Header
          iconSixthSenseStatus
          activeSixthSenseIcon={handleAddToCart}
          iconCanaryStatus
          iconFireStatus
          iconStartStatus
          changeTimeRange={jest.fn()}
          iconGoutStatus
          showLeftPanel
          openLeftMenu={jest.fn()}
          handleContextMenuFire={jest.fn()}
          handleContextMenuGout={jest.fn()}
          // ---- quitar este atributo
          banner_kpis={banner_kpis}
          // --------------------------
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0,
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
        />
      );
      header
        .find('.fireIconContainer')
        .at(0)
        .simulate('click');
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
    });

    it('Simulate click toggleHeaderButtons with flame status', () => {
      const handleAddToCart = jest.fn();
      const banner_kpis = [
        {
          type: 100,
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Total Order Value',
          prefix: '$',
          suffix: '',
          query:
            'SELECT count(*) as value FROM Transaction SINCE 5 minutes AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Max Duration',
          prefix: '',
          suffix: '',
          query:
            'SELECT max(duration) as value FROM Transaction SINCE 30 minutes AGO',
          value: 0
        }
      ];
      const kpis = [
        {
          index: 0,
          type: 101,
          name: "Unique Visitors",
          shortName: "Unique",
          link: "https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: true
        },
        {
          index: 1,
          type: 101,
          name: "1 Account",
          shortName: "1 Acc.",
          link: "https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: false
        }
      ];
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
          // ---- quitar este atributo
          banner_kpis={banner_kpis}
          // --------------------------
          ToggleHeaderButtons={handleAddToCart}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0,
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
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
      const banner_kpis = [
        {
          type: 100,
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Total Order Value',
          prefix: '$',
          suffix: '',
          query:
            'SELECT count(*) as value FROM Transaction SINCE 5 minutes AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Max Duration',
          prefix: '',
          suffix: '',
          query:
            'SELECT max(duration) as value FROM Transaction SINCE 30 minutes AGO',
          value: 0
        }
      ];
      const kpis = [
        {
          index: 0,
          type: 101,
          name: "Unique Visitors",
          shortName: "Unique",
          link: "https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: true
        },
        {
          index: 1,
          type: 101,
          name: "1 Account",
          shortName: "1 Acc.",
          link: "https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: false
        }
      ];
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
          // ---- quitar este atributo
          banner_kpis={banner_kpis}
          // --------------------------
          ToggleHeaderButtons={handleAddToCart}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0,
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
        />
      );
      header
        .find('.fireIconContainer')
        .at(2)
        .simulate('click');
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
    });

    it('Banner kpis change order and values boolean', () => {
      const banner_kpis = [
        {
          type: 100,
          description: 'Total Order Count',
          prefix: '$',
          suffix: 'Orders',
          query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Total Order Value',
          prefix: '',
          suffix: '',
          query:
            'SELECT count(*) as value FROM Transaction SINCE 5 minutes AGO',
          value: 0
        },
        {
          type: 100,
          description: 'Max Duration',
          prefix: '$',
          suffix: '',
          query:
            'SELECT max(duration) as value FROM Transaction SINCE 30 minutes AGO',
          value: 0
        }
      ];
      const kpis = [
        {
          index: 0,
          type: 101,
          name: "Unique Visitors",
          shortName: "Unique",
          link: "https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: true
        },
        {
          index: 1,
          type: 101,
          name: "1 Account",
          shortName: "1 Acc.",
          link: "https://chart-embed.service.newrelic.com/herald/5817c955-7920-4367-86e5-e8a998852863?height=400px&timepicker=true",
          query: "SELECT count(*) as value  FROM Transaction COMPARE WITH 2 day ago",
          value: {
            current: 0,
            previous: 0
          },
          check: false
        }
      ];
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
          // ---- quitar este atributo
          banner_kpis={banner_kpis}
          // --------------------------
          ToggleHeaderButtons={jest.fn()}
          logoSetup={{ type: 'default' }}
          timeRangeKpi={{
            index: 0,
          }}
          changeTimeRangeKpi={jest.fn()}
          kpis={kpis}
          updateDataKpisChecked={jest.fn()}
          // ---- quitar este atributo
          DisplayConsole={jest.fn()}
          // --------------------------
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
});
