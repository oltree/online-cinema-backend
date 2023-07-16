import { Controller } from '@nestjs/common';
import {
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '../auth/decorators/admin.decorator';
import { Roles } from '../shared/enums/roles.enum';

import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    return this.FileService.saveFiles([file], folder);
  }
}
