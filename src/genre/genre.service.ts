import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';
import { GenreDto } from './genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.GenreModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' });
  }

  async bySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug });

    if (!genre) {
      throw new NotFoundException('Genre not found!');
    }

    return genre;
  }

  async getPopular() {
    return this.GenreModel.find()
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' });
  }

  /* async getCollections() {
		const genres = await this.getAll()

		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.MovieService.byGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					title: genre.name,
					slug: genre.slug,
					image: moviesByGenre[0]?.bigPoster,
				}

				return result
			})
		)

		return collections
	} */

  // for admin

  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id);

    if (!genre) {
      throw new NotFoundException('Genre not found!');
    }

    return genre;
  }

  async create() {
    const defaultValue: GenreDto = {
      description: '',
      icon: '',
      name: '',
      slug: '',
    };
    const genre = await this.GenreModel.create(defaultValue);

    return genre._id;
  }

  async update(_id: string, dto: GenreDto) {
    const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!updateGenre) {
      throw new NotFoundException('Genre not found!');
    }

    return updateGenre;
  }

  async delete(id: string) {
    const deleteGenre = await this.GenreModel.findByIdAndDelete(id);

    if (!deleteGenre) {
      throw new NotFoundException('Genre not found!');
    }

    return deleteGenre;
  }
}
