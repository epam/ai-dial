import fetch from 'jest-fetch-mock';
import { ThemesApi } from '../themes-api';

describe('Server :: ThemesApi', () => {
  const instance = new ThemesApi();

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Should call get applications', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'response' }));
    instance.getThemes();

    expect(fetch.mock.calls.length).toEqual(1);

    const url = fetch.mock.calls[0][0];
    const call = fetch.mock.calls[0][1];
    expect((url as string).endsWith(`/config.json`)).toBeTruthy();
  });
});
