import { Controller, Get, Param } from 'routing-controllers';
import 'reflect-metadata';

@Controller()
export class UserController {
  @Get('/users/:id')
  getOne (@Param('id') id: number) {
    console.log('do something in Get...');
    return 'This action returns user #' + id;
  }
}
