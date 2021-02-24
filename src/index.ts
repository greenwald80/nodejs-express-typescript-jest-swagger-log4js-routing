import dotenv from 'dotenv';
import log4js from 'log4js';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controller/user-controller';
import httpContext from 'express-http-context';
import express, { Express } from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

const app: Express = express();
app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
  controllers: [UserController] // we specify controllers we want to use
});

app.use((req, res, next) => {
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
}
);

// http://localhost:3000/users/1 => This action returns user #1
