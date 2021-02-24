export function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something Before...');
  next();
}

export function loggingAfter ({ request, response, next }: { request: any; response: any; next?: (err?: any) => any; }): any {
  console.log('do something After...');
  next();
}
