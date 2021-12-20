import React from 'react';
import { create } from 'react-test-renderer';
import Header from '../../../components/Header/Header';

jest.mock(
  'nr1',
  () => {
    const window = {
      open: jest.fn()
    };
    const Icon = {
      type: jest.fn()
    };
    return {
      window,
      Icon
    };
  },
  { virtual: true }
);

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
const credentials = {
  login: true
};
describe('Header component', () => {
  const { open } = window;
  beforeAll(() => {
    delete window.open;
    window.open = jest.fn();
  });
  afterAll(() => {
    window.open = open;
  });
  test('Header component with default data', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
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
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with iconSixthSenseStatus', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with iconCanaryStatus', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
        iconCanaryStatus
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with iconFireStatus', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        iconFireStatus
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with iconStartStatus', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        iconStartStatus
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with iconGoutStatus', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        iconStartStatus={false}
        changeTimeRange={jest.fn()}
        iconGoutStatus
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with showLeftPanel', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        iconStartStatus={false}
        changeTimeRange={jest.fn()}
        iconGoutStatus={false}
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
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with logoSetup Text', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
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
        logoSetup={{
          type: 'text',
          text: 'Logo Text'
        }}
        timeRangeKpi={{
          index: 0
        }}
        changeTimeRangeKpi={jest.fn()}
        kpis={kpis}
        updateDataKpisChecked={jest.fn()}
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });

  test('Header component with logoSetup URL', async () => {
    const header = create(
      <Header
        iconSixthSenseStatus={false}
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
        logoSetup={{
          type: 'url',
          url:
            'https://www.howdeniberia.com/wp-content/uploads/2018/05/Disney-logo-png-transparent-download.png'
        }}
        timeRangeKpi={{
          index: 0
        }}
        changeTimeRangeKpi={jest.fn()}
        kpis={kpis}
        updateDataKpisChecked={jest.fn()}
        DisplayConsole={jest.fn()}
        credentials={credentials}
        accountId={2710112}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });
});
