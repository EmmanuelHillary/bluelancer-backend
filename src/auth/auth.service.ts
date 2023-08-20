import {
  ForbiddenException,
  HttpException,
  UnauthorizedException,
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import EmailService from '../email/email.service';
var phoneToken = require('generate-sms-verification-code');

// Create a transporter using SMTP transport
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // Use SSL
//   auth: {
//     user: 'your_email@gmail.com',
//     pass: 'your_email_password',
//   },
// });

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService, // private emailService: EmailService,
  ) {}
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      isWorker,
      occupation,
    } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = new this.userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        isWorker,
        occupation,
      });
      if (isWorker && !occupation) {
        throw new HttpException(
          'Occupation must be provided for worker accounts',
          400,
        );
      }

      await user.save();

      return await this.userModel.findOne({ email }).select('-password').exec();
      // const token = await this.jwtService.sign({ id: user._id });
      // return { token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Email already exists');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  generateUserVerificationCode() {
    console.log('I generated the OTP');
    return phoneToken(6);
  }
  async sendVerificationOTP(email: string) {
    const verificationCode = this.generateUserVerificationCode();
    // await this.usersService.findOneAndUpdate(
    //   { email },
    //   {
    //     smsOTP: verificationCode,
    //     otpExpirationDate: moment().add(5, 'm').toDate(),
    //   },
    // );
    const text = `Your verification code is: ${verificationCode}`;

    const otp = await this.userModel.findOneAndUpdate(
      { email },
      {
        otp: verificationCode,
        expiresAt: moment().add(5, 'm').toDate(),
      },
    );
    this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
    console.log('Email sent Succesfully');
  }

  async validateOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    const currentTime = moment().toDate();
    if (
      !user ||
      !user.otp ||
      user.otp !== otp ||
      currentTime > user.expiresAt
    ) {
      throw new BadRequestException('Invalid OTP');
    }
    return true;
  }
}
