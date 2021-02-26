import dotenv from 'dotenv';
import log4js from 'log4js';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controller/user-controller';
import httpContext from 'express-http-context';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import { GlobalErrorHandler } from './middleware/global-error-handler';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../src/swagger/openapi.json';
import cors from 'cors';
import config from 'config';

dotenv.config();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

const app: Express = express();
app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController], // we specify controllers we want to use
  middlewares: [GlobalErrorHandler], // добавил свой обработчик ошибок
  defaultErrorHandler: false // чтобы не срабатывал дефолтный error handler
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors() as RequestHandler);

// в последней версии httpContext можно не писать блок ниже:
// app.use((req, res, next) => {
//   httpContext.ns.bindEmitter(req);
//   httpContext.ns.bindEmitter(res);
// });

// const port = process.env.PORT;
const port = config.get('PORT');
app.listen(port, () => {
  console.log(`Running on port ${port}`);
}
);

// http://localhost:3000/users/1 => This action returns user #1
