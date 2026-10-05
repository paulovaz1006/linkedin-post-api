import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostStatus } from './schemas/post.schema.js';



@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async create(content: string) {
    if (!content?.trim()) {
      throw new BadRequestException(
        'O conteúdo do post é obrigatório',
      );
    }

    const post = await this.postModel.create({
      content: content.trim(),
      status: PostStatus.DRAFT,
    });

    return post;
  }

  async findAll() {
    return this.postModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).lean();

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return post;
  }

  async update(id: string, content: string) {
    if (!content?.trim()) {
      throw new BadRequestException(
        'O conteúdo do post é obrigatório',
      );
    }

    const post = await this.postModel.findByIdAndUpdate(
      id,
      {
        content: content.trim(),
      },
      {
        new: true,
      },
    );

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return post;
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return {
      message: 'Post removido com sucesso',
    };
  }

  async publish(id: string) {
    const post = await this.postModel.findByIdAndUpdate(
      id,
      {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        scheduledAt: null,
      },
      {
        new: true,
      },
    );

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return post;
  }

  async schedule(
    id: string,
    scheduledAt: Date,
  ) {
    if (scheduledAt <= new Date()) {
      throw new BadRequestException(
        'A data de agendamento deve ser futura',
      );
    }

    const post = await this.postModel.findByIdAndUpdate(
      id,
      {
        status: PostStatus.SCHEDULED,
        scheduledAt,
        publishedAt: null,
      },
      {
        new: true,
      },
    );

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return post;
  }

  async cancel(id: string) {
    const post = await this.postModel.findByIdAndUpdate(
      id,
      {
        status: PostStatus.CANCELLED,
        scheduledAt: null,
      },
      {
        new: true,
      },
    );

    if (!post) {
      throw new NotFoundException(
        'Post não encontrado',
      );
    }

    return post;
  }
}