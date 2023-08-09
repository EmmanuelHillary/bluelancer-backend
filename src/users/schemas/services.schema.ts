// src/users/schemas/service.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


export type ServiceDocument = Service & Document;
@Schema()
export class Service extends Document {
  @Prop()
  companyName: string;

  @Prop()
  occupation: string;

  @Prop()
  openingTime: string;

  @Prop()
  closingTime: string;

  @Prop()
  minPrice: number;

  @Prop()
  maxPrice: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User'})
  user: MongooseSchema.Types.ObjectId;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
