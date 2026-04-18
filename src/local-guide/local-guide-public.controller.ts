import { Controller, Get, Param } from '@nestjs/common';
import { LocalGuideService } from './local-guide.service';

@Controller('local-guide')
export class LocalGuidePublicController {
  constructor(private readonly guide: LocalGuideService) {}

  @Get()
  list() {
    return this.guide.listPublic();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.guide.getPublic(id);
  }
}
