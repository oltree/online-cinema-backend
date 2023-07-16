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

import { Auth } from '../auth/decorators/admin.decorator';

import { ActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller('actor')
export class ActorController {
  constructor(private readonly ActorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.ActorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.ActorService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth(Roles.Admin)
  async get(@Param('id', IdValidationPipe) id?: string) {
    return this.ActorService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  async create() {
    return this.ActorService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto
  ) {
    return this.ActorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.delete(id);
  }
}
