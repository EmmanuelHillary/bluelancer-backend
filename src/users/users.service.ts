import { BadRequestException, HttpException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User,UserDocument } from '../auth/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePasswords, hashPassword } from './utils';
import { Service, ServiceDocument } from './schemas/services.schema';
import { ServiceDetailsDto } from './dto/serviceDetails.dto';
import { Cloudinary } from './cloudinary.service';

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(User.name) private readonly userModel:  Model<UserDocument>,
    private cloud: Cloudinary
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

    async changePassword(userId, oldPassword: string, newPassword: string): Promise<void> {
      const user = await this.userModel.findById(userId);
      
      
      // Verify the old password
      const isOldPasswordValid = await comparePasswords(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Invalid old password');
      }
  
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
  
      // Update the user's password
      await this.userModel.findOneAndUpdate({_id : userId}, {password : hashedPassword});
    }
      
    async provideServiceDetails(userId: string, serviceDetailsDto: ServiceDetailsDto): Promise<void> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      let service = await this.serviceModel.findOne({ user: userId });
    
      // Create a new service document if it doesn't exist
      if (!service) {
        service = new this.serviceModel({
          user: userId,
          companyName: serviceDetailsDto.companyName,
          occupation: serviceDetailsDto.occupation,
          openingTime: serviceDetailsDto.openingTime,
          closingTime: serviceDetailsDto.closingTime,
          minPrice: serviceDetailsDto.minPrice,
          maxPrice: serviceDetailsDto.maxPrice,
        });
    
        await service.save();
      } else {
        // Update the existing service document
        service.companyName = serviceDetailsDto.companyName;
        service.occupation = serviceDetailsDto.occupation;
        service.openingTime = serviceDetailsDto.openingTime;
        service.closingTime = serviceDetailsDto.closingTime;
        service.minPrice = serviceDetailsDto.minPrice;
        service.maxPrice = serviceDetailsDto.maxPrice;
    
        await service.save();
      }
    
      // Update the user's 'service' field with the service ID
      user.service = service._id;
      console.log('user service: ', user);
      await user.save();
    }

    async findUserByIdService(id: string): Promise<User> {
      const user = await this.userModel.findById(id).populate('service').select('-password').exec();;
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  
    async findUserServiceDetails(userId: string): Promise<Service | null> {
      const service = await this.serviceModel.findOne({ user: userId });
      return service;
    }
  
    async assignProfileImageToUser(userId: string, imageUrl: string): Promise<void> {
      // Fetch the user by their ID from the database
      const user = await this.userModel.findById(userId);
  
      // Update the user's profile picture
      user.profilePicture = imageUrl;
  
      // Save the updated user profile back to the database
      await user.save();
    }

    async handleMultipleUploads(files: Express.Multer.File[]) {
      const fileLinks: string[] = [];
  
      if (!files.length) {
        throw new NotAcceptableException('At least one file must be uploaded');
      }
  
      for await (const file of files) {
        const key = file.originalname.split('.')[0];
        const data = await this.cloud.uploadFile(file.path, { public_id: key });
  
        fileLinks.push(data.url);
      }
  
      if (files.length !== fileLinks.length) {
        throw new BadRequestException('Unable to upload some file');
      }
  
      const successfulUploads = fileLinks.filter(Boolean);
      return successfulUploads;
    }

}


