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
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/admin.decorator';
import { Roles } from 'src/shared/enums/roles.enum';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { User } from 'src/user/user.decorator';
import { RatingDto } from './rating.dto';

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
