import { Controller } from '@nestjs/common';
import { FileService } from './file.service';
import {
  Post,
  HttpCode,
  UploadedFile,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../shared/enums/roles.enum';
import { Auth } from '../auth/decorators/admin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly FileService: FileService) {}

  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    return this.FileService.saveFiles([file], folder);
  }
}
