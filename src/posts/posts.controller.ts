import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as HttpPost,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';


@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @HttpPost()
  create(@Body('content') content: string) {
    return this.postsService.create(content);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.postsService.update(id, content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.postsService.publish(id);
  }

  @Patch(':id/schedule')
  schedule(
    @Param('id') id: string,
    @Body('scheduledAt') scheduledAt: string,
  ) {
    return this.postsService.schedule(
      id,
      new Date(scheduledAt),
    );
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.postsService.cancel(id);
  }
}