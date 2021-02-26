import bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import { useExpressServer } from 'routing-controllers';
import { GlobalErrorHandler } from '../../src/middleware/global-error-handler';
import { UserController } from '../../src/controller/user-controller';
import { Info } from '../../src/model/info';

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // using jest
  it('postOne', () => {
    const userController = new UserController();
    const testBody = {
      country: 'Israel',
      city: 'Haifa'
    };
    const res = userController.postOne(1, testBody as Info);
    expect(res); // .toBeUndefined();
  });

  // using supertest
  let server;
  beforeAll(async () => {
    server = express();
    server.use(bodyParser.json());
    useExpressServer(server, {
      controllers: [UserController], // we specify controllers we want to use
      middlewares: [GlobalErrorHandler],
      defaultErrorHandler: false
    });
  });
  // тестирую как api endpoint
  it('postOne with validations', done => {
    request(server)
      .post('/users/1')
      .send({
        country: 'Israel',
        city: 'Haifa'
      } as Info)
      .expect(204)
      .end((err, res) => {
        if (err) throw new Error(JSON.stringify(res.body));
        done();
      });
  });
});
