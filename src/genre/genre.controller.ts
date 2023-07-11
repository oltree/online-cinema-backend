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
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/admin.decorator';
import { Roles } from 'src/shared/enums/roles.enum';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';

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

  /* @Get('/collections')
  async getCollections() {
    return this.GenreService.getCollections();
  } */

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
    @Body() dto: CreateGenreDto
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
