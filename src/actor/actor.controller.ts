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
import { ActorService } from './actor.service';
import { ActorDto } from './actor.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Roles } from 'src/shared/enums/roles.enum';
import { Auth } from '../auth/decorators/admin.decorator';

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
