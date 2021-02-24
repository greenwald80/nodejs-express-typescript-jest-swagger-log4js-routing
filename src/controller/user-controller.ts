import { Controller, Get, Param, UseBefore, UseAfter, UseInterceptor, Action } from 'routing-controllers';
import 'reflect-metadata';
import { loggingBefore, loggingAfter } from '../middleware/middleware';

@Controller()
@UseBefore(loggingBefore)
@UseAfter(loggingAfter)
@UseInterceptor(function (action: Action, content: any) {
  console.log('change response...');
  content = 'content from UseInterceptor';
  return content;
})
export class UserController {
  @Get('/users/:id')
  getOne (@Param('id') id: number) {
    console.log('do something in Get...');
    return 'This action returns user #' + id;
  }
}
