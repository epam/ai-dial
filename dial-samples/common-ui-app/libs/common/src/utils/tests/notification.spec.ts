import { getErrorNotification } from '../notification';
import { NotificationType } from '../../models/notification';

describe('Utils :: isValueTruthy', () => {
  it('Should return error notification', async () => {
    const result = getErrorNotification('header', 'description', null);
    expect(result).toEqual({
      type: NotificationType.error,
      title: 'header',
      description: 'description',
      duration: null,
    });
  });

  it('Should return empty error notification', async () => {
    const result = getErrorNotification();
    expect(result).toEqual({
      type: NotificationType.error,
      title: '',
      description: '',
      duration: null,
    });
  });
});
