require('jest-fetch-mock').enableMocks();

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
