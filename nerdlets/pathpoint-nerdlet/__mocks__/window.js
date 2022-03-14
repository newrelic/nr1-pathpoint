jest.mock(
  'window',
  () => {
    const window = {
      open: jest.fn()
    };
    return { window };
  },
  { virtual: true }
);
