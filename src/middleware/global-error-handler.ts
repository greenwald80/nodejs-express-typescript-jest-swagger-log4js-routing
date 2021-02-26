import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: any, request: any, response: any, next: () => any) {
    // response.send({ ERROR: error });// пропускает только со статусом 200 в ответе (если не пройдет валидацию, не пропустит)
    response.status(error.statusCode || error.httpCode).json(error);// работает также со статусом 400, отображает причину ошибки
    next();
  }
}
