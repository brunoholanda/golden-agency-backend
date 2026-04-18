import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

type AuthedReq = Request & { user: { id: string } };

@Controller('admin/blog')
@UseGuards(AuthGuard('jwt'))
export class BlogAdminController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  list() {
    return this.blog.listAdmin();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.blog.getAdminById(id);
  }

  @Post()
  create(@Body() dto: CreateBlogPostDto, @Req() req: AuthedReq) {
    return this.blog.create(dto, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blog.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blog.remove(id);
  }
}
