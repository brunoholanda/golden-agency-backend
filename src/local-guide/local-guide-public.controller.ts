import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocalGuideService } from './local-guide.service';

@Controller('local-guide')
export class LocalGuidePublicController {
  constructor(private readonly guide: LocalGuideService) {}

  @Get()
  list(@Query('category') category?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    const parsedPage = Number.parseInt(page ?? '', 10);
    const parsedLimit = Number.parseInt(limit ?? '', 10);
    const safePage = Number.isFinite(parsedPage) ? parsedPage : 1;
    const safeLimit = Number.isFinite(parsedLimit) ? parsedLimit : 10;
    return this.guide.listPublic(category, safePage, safeLimit);
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
