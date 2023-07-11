import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { UserDto } from './user.dto';
import { SALT_ROUND } from 'src/shared/constants/salt';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async updateProfile(_id: string, { email, password, isAdmin }: UserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.UserModel.findOne({ email });

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email is busy!');
    }

    if (password) {
      const salt = await genSalt(SALT_ROUND);
      user.password = await hash(password, salt);
    }

    user.email = email;

    if (isAdmin || isAdmin === false) {
      user.isAdmin = isAdmin;
    }

    await user.save();

    return;
  }

  async getCount() {
    return this.UserModel.find().count();
  }

  async delete(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' });
  }
}
