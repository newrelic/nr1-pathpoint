import React from 'react';
import { create } from 'react-test-renderer';
import Header from '../../../components/Header/Header';

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

describe("Header component", () => {
  test("Header component with default data", () => {
    const header = create(
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
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with iconSixthSenseStatus", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={true}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={false}
				iconFireStatus={false}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with iconCanaryStatus", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={true}
				iconFireStatus={false}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with iconFireStatus", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={false}
				iconFireStatus={true}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with iconStartStatus", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={false}
				iconFireStatus={false}
				iconStartStatus={true}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with iconGoutStatus", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={false}
				iconFireStatus={false}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={true}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with showLeftPanel", () => {
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={jest.fn()}
				iconCanaryStatus={false}
				iconFireStatus={false}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={true}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{ type: 'default' }}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with logoSetup Text", () => {
    const header = create(
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
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{
					type: 'text',
					text: 'Logo Text'
				}}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with logoSetup URL", () => {
    const header = create(
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
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				logoSetup={{
					type: 'url',
					url: 'https://www.howdeniberia.com/wp-content/uploads/2018/05/Disney-logo-png-transparent-download.png'
				}}
				DisplayConsole={jest.fn()}
			/>
		);
    expect(header.toJSON()).toMatchSnapshot();
  });

	test("Header component with emulate activeSixthSenseIcon", () => {
		const handleAddToCart = jest.fn();
    const header = create(
			<Header
				iconSixthSenseStatus={false}
				activeSixthSenseIcon={handleAddToCart}
				iconCanaryStatus={false}
				iconFireStatus={false}
				iconStartStatus={false}
				changeTimeRange={jest.fn()}
				iconGoutStatus={false}
				showLeftPanel={false}
				openLeftMenu={jest.fn()}
				handleContextMenuFire={jest.fn()}
				banner_kpis={banner_kpis}
				ToggleHeaderButtons={jest.fn()}
				DisplayConsole={jest.fn()}
				logoSetup={{
					type: 'url',
					url: 'https://www.howdeniberia.com/wp-content/uploads/2018/05/Disney-logo-png-transparent-download.png'
				}}
			/>
		);
		expect(header.toJSON()).toMatchSnapshot();
  });
});
