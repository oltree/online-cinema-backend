import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { Roles } from '@/shared/enums/roles.enum';

import { IdValidationPipe } from '@/pipes/id.validation.pipe';

import { Auth } from '../auth/decorators/admin.decorator';

import { User } from './user.decorator';
import { UserDto } from './user.dto';
import { UserModel } from './user.model';
import { UserService } from './user.service';

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

  @Get('profile/favorites')
  @Auth(Roles.User)
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.UserService.getFavoriteMovies(_id);
  }

  @Put('profile/favorites')
  @HttpCode(200)
  @Auth(Roles.User)
  async toggleFavorite(
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User() user: UserModel
  ) {
    return this.UserService.toggleFavorite(movieId, user);
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
