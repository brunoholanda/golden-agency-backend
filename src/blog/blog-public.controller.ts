import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogPublicController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  list() {
    return this.blog.listPublic();
  }

  @Get('headlines')
  headlines(@Query('limit') limit?: string) {
    const parsedLimit = Number.parseInt(limit ?? '', 10);
    return this.blog.listHeadlinesPublic(Number.isFinite(parsedLimit) ? parsedLimit : 2);
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.blog.getBySlugPublic(slug);
  }
}
