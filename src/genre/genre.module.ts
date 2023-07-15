import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreController } from './genre.controller';
import { GenreModel } from './genre.model';
import { GenreService } from './genre.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  controllers: [GenreController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre',
        },
      },
    ]),
    MovieModule,
  ],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
