import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref, prop } from '@typegoose/typegoose';
import { MovieModel } from 'src/movie/movie.model';

export interface UserModel extends Base {} // lifehack for add _id in UserModel

export class UserModel extends TimeStamps {
  @prop({ unique: true }) // this is a decorator to indicate to the field
  email: string;

  @prop()
  password: string;

  @prop({ default: false })
  isAdmin?: boolean;

  @prop({ default: [], ref: () => MovieModel })
  favorites?: Ref<MovieModel>[];
}
