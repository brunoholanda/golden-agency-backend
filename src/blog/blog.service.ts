import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { slugifyTitle } from '../common/slug.util';
import { BlogPost } from '../entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(BlogPost) private readonly repo: Repository<BlogPost>) {}

  excerpt(body: string, len = 220) {
    const plain = body.replace(/[#*_`[\]]/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.length <= len ? plain : plain.slice(0, len) + '…';
  }

  async listPublic() {
    const rows = await this.repo.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'title', 'slug', 'body', 'imageUrl', 'tags', 'createdAt'],
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: this.excerpt(r.body),
      imageUrl: r.imageUrl,
      tags: r.tags,
      createdAt: r.createdAt,
    }));
  }

  async getBySlugPublic(slug: string) {
    const post = await this.repo.findOne({ where: { slug, published: true } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async listAdmin() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async getAdminById(id: string) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async create(dto: CreateBlogPostDto, authorId: string) {
    const slug = slugifyTitle(dto.title);
    const post = this.repo.create({
      title: dto.title.trim(),
      slug,
      body: dto.body,
      imageUrl: dto.imageUrl.trim(),
      tags: dto.tags.map((t) => t.trim()).filter(Boolean),
      published: dto.published ?? true,
      authorId,
    });
    return this.repo.save(post);
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');
    if (dto.title !== undefined) {
      post.title = dto.title.trim();
      post.slug = slugifyTitle(dto.title);
    }
    if (dto.body !== undefined) post.body = dto.body;
    if (dto.imageUrl !== undefined) post.imageUrl = dto.imageUrl.trim();
    if (dto.tags !== undefined) post.tags = dto.tags.map((t) => t.trim()).filter(Boolean);
    if (dto.published !== undefined) post.published = dto.published;
    return this.repo.save(post);
  }

  async remove(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Post não encontrado');
    return { ok: true };
  }
}
