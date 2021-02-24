import httpContext from 'express-http-context';

export function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something Before...');
  console.log('set traceId = 123');
  httpContext.set('traceId', 123);
  next();
}

export function loggingAfter ({ request, response, next }: { request: any; response: any; next?: (err?: any) => any; }): any {
  console.log('do something After...');
  console.log(`traceId = ${httpContext.get('traceId')}`);
  next();
}
