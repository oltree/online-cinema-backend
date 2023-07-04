import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash, compare } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';

import { AuthDto } from './dto/auth.dto';
import { UserModel } from '../user/user.model';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}

  async register(dto: AuthDto) {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        'User with this email is already in the system!'
      );
    }

    const salt = await genSalt(this.saltRounds);

    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt),
    });

    return newUser.save();
  }

  async login(dto: AuthDto) {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password!');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }
}
