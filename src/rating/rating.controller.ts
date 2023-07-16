import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { Roles } from '@/shared/enums/roles.enum';

import { IdValidationPipe } from '@/pipes/id.validation.pipe';

import { Auth } from '@/auth/decorators/admin.decorator';

import { User } from '@/user/user.decorator';

import { RatingDto } from './rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService: RatingService) {}

  @Get(':movieId')
  @Auth(Roles.User)
  async getMovieRatingByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId
  ) {
    return this.RatingService.getMovieRatingByUser(movieId, _id);
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth(Roles.User)
  async setRating(
    @User('_id') _id: Types.ObjectId,
    @Body()
    dto: RatingDto
  ) {
    return this.RatingService.setRating(_id, dto);
  }
}
