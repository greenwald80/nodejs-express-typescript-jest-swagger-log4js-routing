// import { Controller, Get, Param, UseBefore, UseAfter, UseInterceptor, Action, Post, Body } from 'routing-controllers';
import { Controller, Get, Param, UseBefore, UseAfter, Post, Body, OnUndefined } from 'routing-controllers';

import 'reflect-metadata';
import { loggingBefore, loggingAfter } from '../middleware/middleware';
import { Info } from '../model/info';

@Controller()
@UseBefore(loggingBefore)
@UseAfter(loggingAfter)
// @UseInterceptor(function (action: Action, content: any) {
//   console.log('change response...');
//   content = 'content from UseInterceptor';
//   return content;
// })
export class UserController {
  @Get('/users/:id')
  getOne (@Param('id') id: number) {
    console.log('do something in Get...');
    return 'This action returns user #' + id;
  }

  @Post('/users/:id')
  @OnUndefined(204)
  postOne (@Param('id') id: number, @Body() info: Info) {
    console.log(JSON.stringify(info));
    return JSON.stringify(info);
  }
}
