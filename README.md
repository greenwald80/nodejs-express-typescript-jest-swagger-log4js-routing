
Создаем приложение на Node.JS, Express и Typescript с Jest, Swagger, log4js и Routing-controllers
Node.JS
Это пошаговая инструкция создания приложение на Node.JS, с использованием typescript и express. Новое приложение создается не часто, отсюда забываются шаги по его созданию. И я решил написать некую шпаргалку, в помощь самому себе и другим разработчикам. Помимо шагов, я так же снял небольшие видео ролики для наглядности. Существуют уже готовые фреймворки для Node.JS, которые уже содержат в себе все необходимые пакеты и можно работать с ними, но это уже другой путь. Идея была в том, чтобы не зависить целиком от какого-то фреймворка и в случае необходимости менять одни пакеты на другие.

Итак по шагам:

Простое Web приложение youtu.be/7MIIcFDeSg4

Ставим в определенном порядке пакеты и Node.JS, а так же прописываем настройки.

1) node.js download, 
2) Create directory for your project, 
3) npm init, 
4) in package.json
 "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node ."
  }
5) npm install --save-dev typescript, 
6) in tsconfig.json 
  {
  "compilerOptions": {
    "esModuleInterop": true,
    "outDir": "dist",
    "baseUrl": "."
  }
}
8) npm install express, 
9) npm install @types/express, 
10) create src folder, 
11) create src/index.ts with code below:
import express from 'express'

const app = express();
const port = 5000;
app.get('/', (request, response) => {
  response.send('Hello world!');
});
app.listen(port, () => console.log(`Running on port ${port}`));
13) npm run build, 
14) npm run start, 
15) localhost:5000

Отладка и инициализация в Node.js youtu.be/hfST0e1ITGw

Настраиваем режим отладки и создаем .env файл для установки входных значений.

1) in tsconfig.json add: "sourceMap": true
2) int package.json add: "prestart": "npm run build",
3) In IntelliJ IDEA in Run/Debug Configurations choose: "npm" and add script
4) npm i ts-node-dev --save-dev
5) int package.json add: "server:watch": "ts-node-dev --respawn --transpile-only src/index.ts"
6) add IntelliJ IDEA npm for "server:watch" script
7) npm install dotenv
8) in index.ts add: dotenv.config();
9) create .env file in root dir of your project and add text below in .env file:
PORT = 5000
const port = process.env.PORT;

Добавление log4js и eslint к приложению на Node.JS youtu.be/qcSpd6N7ZJ8

1) npm install log4js
2) in index.ts file:
    import log4js from 'log4js';
    ...
    const logger = log4js.getLogger();
    logger.level = process.env.LOG_LEVEL;
    ...
4) in .env file: LOG_LEVEL=error
5) in index.ts file:
    ...
    logger.info('log4js log info');
    logger.debug('log4js log debug');
    logger.error('log4js log error');
    ...
6) npm install eslint --save-dev
7) eslint --init
8) "prebuild": "npm run lint"
9) "lint:fix": "eslint --cache --ext .ts . --fix",
10) "lint": "eslint --cache --ext .ts .",
    !!! --cache (only changed), .
11) IntelliJ IDEA -- file -- setting -- eslint -- automatic
12) "rules": {
        "semi": ["error", "always"]
    }

Routing controllers для Node.js youtu.be/_7z5Zubsdps

Используем routing-controllers для более удобной работы.

1) npm install routing-controllers
2) npm install reflect-metadata
3) npm install express body-parser multer
4) npm install class-transformer class-validator
5) tsconfig.json
   "compilerOptions": {
      ...
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true
      ...
   }
6) in index.ts
// const app = express();

// logger.info('log4js log info');
// logger.debug('log4js log debug');
// logger.error('log4js log error');

// app.get('/', (request, response) => {
//   response.send('Hello world2!');
// });
7) in index.ts
   import { createExpressServer } from 'routing-controllers';
   import { UserController } from './UserController';

   const app = createExpressServer({
     controllers: [UserController], // we specify controllers we want to use
});

8) controller/user-controller.ts
   import { Controller, Get, Param } from 'routing-controllers';
   import 'reflect-metadata';

   @Controller()
   export class UserController {
     @Get('/users/:id')
     getOne (@Param('id') id: number) {
       return 'This action returns user #' + id;
     }
   }
9) http://localhost:3001/users/1

Node.JS middleware, interceptor, http context youtu.be/iWUMUa7gTTQ

1) middleware -- middleware.ts
2) middleware.ts
export function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something Before...');
  next();
}

export function loggingAfter (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something After...');
  next();
}
3) user-controller.ts in class
@UseBefore(loggingBefore)
@UseAfter(loggingAfter)
console.log('do something in GET function...');
4) user-controller.ts in function
 @UseBefore(loggingBefore)
 @UseAfter(loggingAfter)
5) user-controller.ts in function
 @UseInterceptor(function (action: Action, content: any) {
    console.log('change response...');
    return content;
  })
6) npm install express-http-context
7) index.ts
 
 const app: Express = express();
        app.use(bodyParser.json());
 app.use(httpContext.middleware);
 useExpressServer(app, {
   controllers: [UserController]
 });

 app.use((req, res, next) => {
   httpContext.ns.bindEmitter(req);
   httpContext.ns.bindEmitter(res);
 });

8) middleware.ts loggingBefore
    import httpContext from 'express-http-context';
    
    console.log('set traceId = 123');
    httpContext.set('traceId', 123);
9) middleware.ts loggingAfter
    console.log(`tracedId = ${httpContext.get('traceId')}`);

Node.JS добавляем post запрос, валидация входных данных, глобальный обработчик ошибок youtu.be/onBVkkLEuw4

1) in user-controller.ts add:
  ...
  @Post('/users/:id')
  @OnUndefined(204)
  postOne (@Param('id') id: number, @Body() info: any) {
    console.log(JSON.stringify(info));
  }
  ...
2) in postman
 http://localhost:3001/users/1
 {
 "country":"Russia",
 "city":"SPb"
 }
3) model -- info.ts
4) 
import { IsDefined } from 'class-validator';

export class Info {
  @IsDefined()
  country: string;
  @IsDefined()
  city: string;
}
8) postOne (@Param('id') id: number, @Body() info: Info) {
9) middleware -- global-error-handler.ts
10) 
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: any, request: any, response: any, next: () => any) {
    response.send({ ERROR: error });
    next();
  }
}
11) 
useExpressServer(app, {
  controllers: [UserController], // we specify controllers we want to use
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
});

Swagger документация в Node.JS приложении youtu.be/-uoIasCbsq8

1) npm install swagger-ui-express
2) tsconfig.json -- "resolveJsonModule": true
3) src -- swagger -- openapi.json
4) index.ts
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../src/swagger/openapi.json';
...
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
5) change port to 3000
in .env file set PORT=3000
6) npm install cors
7) npm install @types/cors
8) in index.ts 
import cors from 'cors';
...
app.use(cors() as RequestHandler);
...
9) Swagger Editor (example for test project)

openapi

openapi: 3.0.1
info:
  title: test API
  version: v1
servers:
  - url: 'http://localhost:3000'
tags:
  - name: API functions
    description: >-
      API functions of our application
      
paths:
  /users/{id}:
    get:
     summary: returns simple answer from get
     tags: 
      - API functions
     parameters:
       - name: id
         in: path
         required: true
         description: simple parameter
         schema:
           type : string
           example: '1'
     description: parameter id just for test
     responses:
      '200': #status code
       description: OK
       content:
            document:
              schema:
                type: string
                example: some text
    post:
     summary: returns simple answer from post
     tags: 
      - API functions
     requestBody:
        required: true
        content:
          application/json:
            schema:
               $ref: '#/components/schemas/Info'          
            example:
              country: Russia
              city: Spb
     parameters:
       - name: id
         in: path
         required: true
         description: simple parameter
         schema:
           type : string
           example: '1'
     description: parameter id just for test
     responses:
      '204': #status code
       description: OK
components:
  schemas:
    Info:
      type: object
      properties:
        country:
          type: string
        city:  
          type: string

Добавляем Unit тесты на Jest в приложение на Node.JS youtu.be/rCIRpTMVEMM

0) in global-error-handler.ts
response.status(error.statusCode || error.httpCode).json(error);
    next();

1) npm install --save-dev jest
2) npm i -D ts-jest @types/jest
3) npm i -D ts-jest
4) package.json -- 
{
...
scripts {
...
"test:unit": "jest --config=jest.config.js",
},
...
}
5) create jest.config.js with code below:

process.env.NODE_ENV = 'UNITTEST';
module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**/*.ts'
    ],
    coverageDirectory: '<'rootDir>/test/coverage',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    preset: 'ts-jest'
};

6) .eslintignore
*.js
node_modules
dist
coverage
}
7) .eslintrc.json
{
...
"env": {
   "jest": true
} 
...
} 
8) test -- controller -- user-controller.test.ts

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('postOne', () => {
    const userController = new UserController();
    const testBody = {
      city: 'SPb'
    };
    const res = userController.postOne(1, testBody as Info);
    expect(res).toBeUndefined();
  });
}

9) in IDEA
add script - test:unit
set in environment - NODE_ENV=UNITTEST
10) Simple variant of jest.config.js for IDEA:
process.env.NODE_ENV = 'UNITTEST';
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  preset: 'ts-jest'
};
11) npm i -D supertest @types/supertest
12) in user-controller.test.ts
...
let server;
...
beforeAll(async () => {
    server = express();
    server.use(bodyParser.json());
    useExpressServer(server, {
      controllers: [UserController], // we specify controllers we want to use
      middlewares: [GlobalErrorHandler],
      defaultErrorHandler: false
    });
  });
...
it('postOne with validations', done => {
    request(server)
      .post('/users/1')
      .send({
        country: 'Russia',
        city: 'SPb'
      } as Info)
      .expect(204)
      .end((err, res) => {
        if (err) throw new Error(JSON.stringify(res.body));
        done();
      });
  });

Использование config для Node.JS, а так же другие полезные пакеты.
youtu.be/8ZCHUN-JTck

Пакет config позволяет устанавливать значения констант при инициализации в зависимости от значения NODE_ENV.

1) npm install config
2) npm install @types/config
3) config
4) default.yaml PORT: 3000 
   DEV.yaml PORT: 3001 
   LOCAL.yaml PORT: 3002 
5) index.ts
   // const port = process.env.PORT;
      const port = config.get('PORT');
6) IDEA server:watch -- Environment
    NODE_ENV=DEV
    NODE_ENV=LOCAL

-- packages:

husky - коммиты в гит
semantic-release - формат коммитов и контроль версий

pretty-quick - запускает prettier на измененных файлах
prettier - формат кода
eslint-config-prettier - разрешает конфликты между eslint и prettier
eslint-plugin-prettier - запускает prettier как правила eslint

mock-socket - мок для вебсокета
jest-websocket-mock - тестирование вебсокета
jest-sonar-reporter - конвертр из формата jest в формат sonar
jest-mock-extended - мок объектов и интерфейсов

ws - вебсокет

typescript-string-operations - String.format
lodash - библиотека дополнительных функций для js
http-status-codes - константы для HTTP статусов
moment - библиотека работы со временем в js

ncp - копирование файлов
js-yaml - загрузка yaml файлов

mongodb - функции для работы с Mongo
migrate-mongo - миграция для Mongo

log-timestamp - запись даты в лог

axios - HTTP клиент

applicationinsights - интеграция с Azure Application Insights

Теги:
node.js
typescript
express
swagger
jest
routing-controllers
log4js
supertest
Хабы:
Node.JS

https://habr.com/ru/post/536512/