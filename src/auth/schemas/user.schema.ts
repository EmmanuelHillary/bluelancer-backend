import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Service } from '../../users/schemas/services.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop()
  isWorker: boolean;

  @Prop()
  occupation?: string;

  @Prop()
  otp: string;

  @Prop()
  expiresAt: Date;

  @Prop()
  profilePicture: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name })
  @Type(() => Service)
  service: Service;

  // @Prop({ type: { value: { type: String }, expiresAt: { type: Date } } })
  // otp: { value: string, expiresAt: Date };
}

export const UserSchema = SchemaFactory.createForClass(User);

// @Schema()
// export class UserDocument extends Document {
//   @Prop({ required: true })
//   email: string;

//   @Prop({ required: true })
//   code: string;

//   @Prop({ type: Date, expires: 600, default: Date.now }) // expires after 10 minutes
//   createdAt: Date;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// export const OTPSchema = SchemaFactory.createForClass(UserDocument);
