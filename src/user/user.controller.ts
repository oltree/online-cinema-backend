import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { User } from './user.decorator';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/admin.decorator';
import { Roles } from 'src/shared/enums/roles.enum';
import { UserDto } from './user.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('profile')
  @Auth(Roles.User)
  async getProfile(@User('_id') _id: string) {
    return this.UserService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth(Roles.User)
  async updateProfile(@User('_id') _id: string, @Body() dto: UserDto) {
    return this.UserService.updateProfile(_id, dto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UserDto
  ) {
    return this.UserService.updateProfile(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return this.UserService.delete(id);
  }

  @Get('count')
  @Auth(Roles.Admin)
  async getCountUsers() {
    return this.UserService.getCount();
  }

  @Get()
  @Auth(Roles.Admin)
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.UserService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth(Roles.Admin)
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return this.UserService.byId(id);
  }
}
