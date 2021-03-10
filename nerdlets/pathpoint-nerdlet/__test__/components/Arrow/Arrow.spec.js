import React from 'react';
import { create } from 'react-test-renderer';
import Arrow from '../../../components/Arrow/Arrow';

describe("Arrow component", () => {
  test("Arrow component with no latency", () => {
    const arrow = create(
			<Arrow
        arrowWidth={12}
        lightColor="blue"
        latencyPercentage={0}
        textLevelBar="Dummy Text"
        showHealth
      />
		);
    expect(arrow.toJSON()).toMatchSnapshot();
  });

	test("Arrow component with latency", () => {
    const arrow = create(
			<Arrow
        arrowWidth={12}
        lightColor="red"
        latencyPercentage={100}
        textLevelBar="Dummy Text"
        showHealth
      />
		);
    expect(arrow.toJSON()).toMatchSnapshot();
  });
});
