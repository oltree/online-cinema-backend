import { Injectable } from '@nestjs/common';
import { RatingModel } from './rating.model';
import { MovieService } from 'src/movie/movie.service';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { RatingDto } from './rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel)
    private readonly RatingModel: ModelType<RatingModel>,
    private readonly MovieService: MovieService
  ) {}

  async getMovieRatingByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.RatingModel.findOne({ movieId, userId })
      .select('value')
      .then((data) => (data ? data.value : 0));
  }

  async averageRatingByMovie(movieId: Types.ObjectId) {
    const ratingsMovie: RatingModel[] =
      await this.RatingModel.aggregate().match({ movieId });

    const averageRatingCalculation =
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingsMovie.length;

    return averageRatingCalculation;
  }

  async setRating(userId: Types.ObjectId, { movieId, value }: RatingDto) {
    const newRating = await this.RatingModel.findOneAndUpdate(
      { movieId, userId },
      {
        userId,
        movieId,
        value,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const averageRating = await this.averageRatingByMovie(movieId);

    await this.MovieService.updateRating(movieId, averageRating);

    return newRating;
  }
}
