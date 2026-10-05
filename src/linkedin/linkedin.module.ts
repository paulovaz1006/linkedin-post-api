import { Module } from '@nestjs/common';
import { LinkedinController } from './linkedin.controller.js';
import { LinkedinService } from './linkedin.service.js';

@Module({
  controllers: [LinkedinController],
  providers: [LinkedinService]
})
export class LinkedinModule {}
