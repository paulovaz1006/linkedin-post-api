import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

@Schema({
  timestamps: true,
  collection: 'posts',
})
export class Post {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    required: true,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Prop({
    type: Date,
  })
  scheduledAt?: Date;

  @Prop({
    type: Date,
  })
  publishedAt?: Date;

  @Prop({
    type: String,
  })
  linkedinPostId?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);