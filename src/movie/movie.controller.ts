import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { Roles } from '@/shared/enums/roles.enum';

import { IdValidationPipe } from '@/pipes/id.validation.pipe';

import { Auth } from '@/auth/decorators/admin.decorator';

import { GenreIdsDto } from './dto/genreIds.dto';
import { MovieDto } from './dto/movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly MovieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.MovieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    return this.MovieService.byActor(actorId);
  }

  @UsePipes(new ValidationPipe())
  @Post('by-genres')
  @HttpCode(200)
  async byGenres(@Body() { genreIds }: GenreIdsDto) {
    return this.MovieService.byGenres(genreIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.MovieService.getAll(searchTerm);
  }

  @Get('/most-popular')
  async getMostPopular() {
    return this.MovieService.getMostPopular();
  }

  @Put('/update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.MovieService.updateCountOpened(slug);
  }

  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  async create() {
    return this.MovieService.create();
  }

  @Get(':id')
  @Auth(Roles.Admin)
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: MovieDto
  ) {
    return this.MovieService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.delete(id);
  }
}
