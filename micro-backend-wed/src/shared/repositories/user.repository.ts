import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../schema/users';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}
  async findOne(query: any): Promise<Users> {
    return this.usersModel.findOne(query);
  }
  async create(data: Record<string, any>): Promise<Users> {
    const createdUser = new this.usersModel(data);
    return createdUser.save();
  }
  async updateOne(query: any, data: Record<string, any>) {
    return await this.usersModel.updateOne(query, data);
  }
  async find(query: any) {
    return await this.usersModel.find(query);
  }
  findById(id: string) {
    return this.usersModel.findById(id);
  }
}
