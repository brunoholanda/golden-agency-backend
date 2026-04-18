import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogPublicController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  list() {
    return this.blog.listPublic();
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.blog.getBySlugPublic(slug);
  }
}
