import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocalGuideService } from './local-guide.service';

@Controller('local-guide')
export class LocalGuidePublicController {
  constructor(private readonly guide: LocalGuideService) {}

  @Get()
  list(@Query('category') category?: string) {
    return this.guide.listPublic(category);
  }

  @Get('categories')
  categories() {
    return this.guide.listPublicCategories();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.guide.getPublic(id);
  }
}
