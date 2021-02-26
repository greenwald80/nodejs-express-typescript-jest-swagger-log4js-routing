import { UserController } from '../../src/controller/user-controller';
import { Info } from '../../src/model/info';

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('postOne', () => {
    const userController = new UserController();
    const testBody = {
      country: 'Israel',
      city: 'Haifa'
    };
    const res = userController.postOne(1, testBody as Info);
    expect(res); // .toBeUndefined();
  });
});
