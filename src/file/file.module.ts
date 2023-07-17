import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
