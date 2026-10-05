import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { LinkedinService } from './linkedin.service.js';
import type { Response } from 'express';

@Controller('linkedin')
export class LinkedinController {
  constructor(
    private readonly linkedinService: LinkedinService,
  ) {}

  @Get('connect')
  connect(@Res() res: Response) {
    try {
    const url = this.linkedinService.getAuthorizationUrl();
    console.log('Redirecting to LinkedIn authorization URL:', url);
    return res.redirect(url);
    } catch (err) {
        console.error('Error during LinkedIn connect:', err);
        return res.status(500).send('Internal Server Error');
    }
  }

  @Get('callback')
  async callback(
     @Query('code') code: string,
  @Query('error') error?: string,
  @Query('error_description') errorDescription?: string,
  @Query('state') state?: string
) {
    try {
        console.log({
            code,
            error,
            errorDescription,
            state,
        });

    if (!code) {
      throw new Error('Authorization code not found');
    }

    return this.linkedinService.getAccessToken(code);
    } catch (err) {
        console.error('Error during LinkedIn callback:', err);
    }
  }

  @Post('post')
  async createPost(
    @Query('accessToken') accessToken: string,
    @Query('text') text: string,
  ) {
    try {
      return this.linkedinService.createPostTeste("Paulo", text);
    } catch (err) {
        console.error('Error during LinkedIn post creation:', err);
    }
  }

  @Get('profile')
  async getProfile(@Query('accessToken') accessToken: string) {
    try {
      return this.linkedinService.getMemberProfile(accessToken);
    } catch (err) {
        console.error('Error during LinkedIn profile retrieval:', err);
    }
  }
  
}