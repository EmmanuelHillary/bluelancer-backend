import { HttpException, Injectable } from '@nestjs/common';
import { User,UserDocument } from '../auth/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User.name)
    private readonly userModel:  Model<UserDocument>
    ){}
    
    
    async findByEmail(email: string): Promise<any> {
        console.log("i'm here");
        return this.userModel.findOne({ email }).orFail(
            new HttpException(
              { message: `Unable to retrieve User with email ${email}` },
              400,
            ),
          );;
      }
    async findUserById(identifier: string): Promise<User> {
        console.log("id :",identifier);
        return await this.userModel.findOne({_id: identifier}).select('-password').orFail(
            new HttpException(
              { message: `Unable to retrieve User with id ${identifier}` },
              400,
            ),
          ).exec();
      }
      async getUser(identifier: string) {
        let user;
    
        user = await this.userModel
          .findOne({ email: identifier })
          .orFail(
            new HttpException(
              { message: `Unable to retrieve User with email ${identifier}` },
              400,
            ),
          );
    
        return user;
    }
      
}


