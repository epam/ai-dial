import { getParsedError } from '../error';

describe('Utils :: isValueTruthy', () => {
  it('Should return error object', async () => {
    const error = { message: 'message' };
    const result = getParsedError(JSON.stringify(error));
    expect(result).toEqual(error);
  });

  it('Should return error from string', async () => {
    const result = getParsedError('failure reason');
    expect(result).toEqual({ message: 'failure reason' });
  });
});
