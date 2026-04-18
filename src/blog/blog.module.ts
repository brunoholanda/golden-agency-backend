import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../entities/blog-post.entity';
import { BlogAdminController } from './blog-admin.controller';
import { BlogPublicController } from './blog-public.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogPublicController, BlogAdminController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
