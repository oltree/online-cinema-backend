import { Controller, Get, HttpCode } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/admin.decorator';
import { Roles } from 'src/auth/auth.enum';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @HttpCode(200)
  @Get('profile')
  @Auth(Roles.User)
  async getProfile(@User('_id') _id: string) {
    return this.UserService.byId(_id);
  }
}
