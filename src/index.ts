import dotenv from 'dotenv';
import log4js from 'log4js';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controller/user-controller';

dotenv.config();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

const app = createExpressServer({
  controllers: [UserController] // we specify controllers we want to use
});
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
}
);

// http://localhost:3000/users/1 => This action returns user #1
