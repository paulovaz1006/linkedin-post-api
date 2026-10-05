import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatus } from '../posts/schemas/post.schema.js';


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async getStats() {
    const [
      totalPosts,
      scheduledPosts,
      publishedPosts,
    ] = await Promise.all([
      this.postModel.countDocuments(),

      this.postModel.countDocuments({
        status: PostStatus.SCHEDULED,
      }),

      this.postModel.countDocuments({
        status: PostStatus.PUBLISHED,
      }),
    ]);

    return {
      totalPosts,
      scheduledPosts,
      publishedPosts,
    };
  }

  async getUpcomingPosts() {
    return this.postModel
      .find({
        status: PostStatus.SCHEDULED,
        scheduledAt: {
          $gte: new Date(),
        },
      })
      .sort({
        scheduledAt: 1,
      })
      .limit(5)
      .lean();
  }
}