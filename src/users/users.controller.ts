import { Controller, Get, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UsersMiddleware } from './users.middleware';
import { CurrentUser } from './users.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
 

@Get('/profile')
@UseGuards(AuthGuard('jwt'))
async getUserDetails(@Request() req): Promise<any> {
    const userId = req.user;
    console.log('second', userId);
    return await this.usersService.findUserById(userId);
    //const email = email; // Assuming the email is stored in the request.user object
    // return await this.usersService.findUserById(user);
  } 
}

