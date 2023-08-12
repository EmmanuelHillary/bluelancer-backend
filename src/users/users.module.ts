import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Service, ServiceSchema } from './schemas/services.schema';
import { Cloudinary } from './cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: Service.name, schema: ServiceSchema},
    ])
],
  controllers: [UsersController],
  providers: [UsersService, JwtService, Cloudinary],
  exports: [UsersService, Cloudinary]
})
export class UsersModule {}

