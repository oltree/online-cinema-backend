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

import { Roles } from '@/shared/enums/roles.enum';

import { IdValidationPipe } from '@/pipes/id.validation.pipe';

import { Auth } from '@/auth/decorators/admin.decorator';

import { GenreDto } from './genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly GenreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.GenreService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.GenreService.getAll(searchTerm);
  }

  @Get('/popular')
  async getPopular() {
    return this.GenreService.getPopular();
  }

  @Get(':id')
  @Auth(Roles.Admin)
  async get(@Param('id', IdValidationPipe) id?: string) {
    return this.GenreService.byId(id);
  }

  @Get('/collections')
  async getCollections() {
    return this.GenreService.getCollections();
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  async create() {
    return this.GenreService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: GenreDto
  ) {
    return this.GenreService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.delete(id);
  }
}
