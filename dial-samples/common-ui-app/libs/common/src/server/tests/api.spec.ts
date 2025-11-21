import fetch from 'jest-fetch-mock';
import { BaseApi } from '../base-api';

const TEST_URL = 'test';
const TEST_POST_URL = `${TEST_URL}/post`;
const TEST_GET_URL = `${TEST_URL}/get`;

jest.mock('jose', () => ({ decodeJwt: jest.fn() }));

describe('Server - api', () => {
  global.console = {
    ...console,
    error: jest.fn(),
  };
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Should check error with status code', async () => {
    fetch.mockResponseOnce(JSON.stringify('Error get'), { status: 400 });
    (new BaseApi({ host: '' }) as any).get(TEST_GET_URL).then((res) => {
      expect(res).toBeNull();
    });
  });

  it('Should check return texts', async () => {
    fetch.mockResponseOnce(JSON.stringify('Response text'), { status: 200, headers: { etag: '1' } });
    (new BaseApi({ host: '' }) as any).get(TEST_GET_URL).then((res) => {
      expect(res).toBe('"Response text"');
    });
  });

  it('Should check return texts', async () => {
    const error = { success: false };
    fetch.mockResponseOnce(JSON.stringify('Error get'), {
      status: 400,
      error: JSON.stringify({ message: 'message', error: 'header' }),
    } as any);
    (new BaseApi({ host: '' }) as any).getAction(TEST_GET_URL).then((res) => {
      expect(res).toMatchObject(error);
    });
  });
});
