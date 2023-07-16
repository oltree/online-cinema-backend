import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

import { TelegramService } from '@/telegram/telegram.service';

import { MovieDto } from './dto/movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel)
    private readonly MovieModel: ModelType<MovieModel>,
    private readonly TelegramService: TelegramService
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('genres actors');
  }

  async bySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug }).populate(
      'genres actors'
    );

    if (!movie) {
      throw new NotFoundException('Movie not found!');
    }

    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const movies = await this.MovieModel.find({ actors: actorId });

    if (!movies) {
      throw new NotFoundException('Movies not found!');
    }

    return movies;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    const movies = await this.MovieModel.find({ genres: { $in: genreIds } });

    if (!movies) {
      throw new NotFoundException('Movies not found!');
    }

    return movies;
  }

  async updateCountOpened(slug: string) {
    return this.MovieModel.findOneAndUpdate(
      { slug },
      { $inc: { countOpened: 1 } },
      { new: true }
    );
  }

  async getMostPopular() {
    return this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres');
  }

  //for admin

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id);

    if (!movie) {
      throw new NotFoundException('Movie not found!');
    }

    return movie;
  }

  async create() {
    const defaultValue: MovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    };

    const movie = await this.MovieModel.create(defaultValue);

    return movie._id;
  }

  async update(_id: string, dto: MovieDto) {
    if (!dto.isSendTelegram) {
      await this.sendNotification(dto);
      dto.isSendTelegram = true;
    }

    const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!updateMovie) {
      throw new NotFoundException('Movie not found!');
    }

    return updateMovie;
  }

  async delete(id: string) {
    const deleteMovie = await this.MovieModel.findByIdAndDelete(id);

    if (!deleteMovie) {
      throw new NotFoundException('Movie not found!');
    }

    return deleteMovie;
  }

  async updateRating(movieId: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      movieId,
      { rating: newRating },
      { new: true }
    );
  }

  async sendNotification({ poster, title }: MovieDto) {
    if (process.env.NODE_ENV !== 'development') {
      await this.TelegramService.sendPhoto(poster);

      const message = `<b>${title}</b>`;

      await this.TelegramService.sendMessage(message, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                url: 'https://kinogo.film/films/12812-bog-jeto-pulja-2023-smotret-onlajn-besplatno.html',
                text: 'Go to watch',
              },
            ],
          ],
        },
      });
    }
  }
}
