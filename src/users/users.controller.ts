import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersMiddleware } from './users.middleware';
import { CurrentUser } from './users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ServiceDetailsDto } from './dto/serviceDetails.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import fileInterceptonOptions, { imageFileFilter } from './utilities/filesinterceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getUserDetails(@Request() req): Promise<any> {
    const userId = req.user;
    console.log('second', userId);
    return await this.usersService.findUserById(userId);
    //const email = email; // Assuming the email is stored in the request.user object
    // return await this.usersService.findUserById(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { password, new_password, reEnterNewpassword } = changePasswordDto;
    const userId = req.user._id;
    console.log('user id', userId);
    if (new_password !== reEnterNewpassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    await this.usersService.changePassword(userId, password, new_password);

    return { message: 'Password changed successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/service')
  async provideService(
    @Request() req,
    @Body() serviceDetailsDto: ServiceDetailsDto,
  ) {
    const userId = req.user._id;
    await this.usersService.provideServiceDetails(userId, serviceDetailsDto);
    return this.usersService.findUserByIdService(userId);
    //return { message: 'Service details provided successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profilePicture', maxCount: 1 }], {
      limits: {
        fileSize: 104857600, // 100MB works as expected
        files: 10,
      },
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfileImage(
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    // Here, you can handle the uploaded file and associate it with the user's profile
    console.log(files);
    const fileLinks = await this.usersService.handleMultipleUploads(
      files.profilePicture,
    );
    const userId = req.user.id;
    const imageUrl = fileLinks[0]; // The Cloudinary URL of the uploaded image

    // Associate the profile image with the user
    await this.usersService.assignProfileImageToUser(userId, imageUrl);

    return {
      message:
        'Profile image uploaded and associated with the user successfully',
      imageUrl,
    };
  }
}
