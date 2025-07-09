import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; 

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async setUserSection(phoneNumber: string, section: string) {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { currentSection: section, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async saveUserState(phoneNumber: string, section: string): Promise<User> {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { section },
      { upsert: true, new: true }
    );
  }
  
  

  async getUser(phoneNumber: string) {
    return this.userModel.findOne({ phoneNumber });
  }
}
