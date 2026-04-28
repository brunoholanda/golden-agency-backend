import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalBusinessCategory } from '../entities/local-business-category.entity';
import { LocalBusiness } from '../entities/local-business.entity';
import { CreateLocalBusinessCategoryDto } from './dto/create-local-business-category.dto';
import { CreateLocalBusinessDto } from './dto/create-local-business.dto';
import { UpdateLocalBusinessCategoryDto } from './dto/update-local-business-category.dto';
import { UpdateLocalBusinessDto } from './dto/update-local-business.dto';

@Injectable()
export class LocalGuideService {
  constructor(
    @InjectRepository(LocalBusiness) private readonly repo: Repository<LocalBusiness>,
    @InjectRepository(LocalBusinessCategory) private readonly categoryRepo: Repository<LocalBusinessCategory>,
  ) {}

  listPublic(category?: string) {
    const normalizedCategory = category?.trim();
    const where = normalizedCategory
      ? { published: true, category: normalizedCategory }
      : { published: true };

    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'title',
        'description',
        'imageUrl',
        'contact',
        'location',
        'category',
        'email',
        'instagram',
        'facebook',
        'site',
        'youtube',
        'createdAt',
      ],
    });
  }

  async getPublic(id: string) {
    const row = await this.repo.findOne({ where: { id, published: true } });
    if (!row) throw new NotFoundException('Comércio não encontrado');
    return row;
  }

  async listPublicCategories() {
    const rows = await this.categoryRepo.find({ order: { name: 'ASC' } });
    return rows.map((row) => row.name);
  }

  listAdmin() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  listAdminCategories() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async createCategory(dto: CreateLocalBusinessCategoryDto) {
    const name = dto.name.trim();
    const exists = await this.findCategoryByNameInsensitive(name);
    if (exists) throw new ConflictException('Categoria já existe');
    return this.categoryRepo.save(this.categoryRepo.create({ name }));
  }

  async updateCategory(id: string, dto: UpdateLocalBusinessCategoryDto) {
    const row = await this.categoryRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Categoria não encontrada');

    const nextName = dto.name.trim();
    const duplicate = await this.findCategoryByNameInsensitive(nextName);
    if (duplicate && duplicate.id !== id) throw new ConflictException('Categoria já existe');

    const previousName = row.name;
    row.name = nextName;
    const saved = await this.categoryRepo.save(row);

    await this.repo
      .createQueryBuilder()
      .update(LocalBusiness)
      .set({ category: nextName })
      .where('category = :previousName', { previousName })
      .execute();

    return saved;
  }

  async getAdminById(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Comércio não encontrado');
    return row;
  }

  async create(dto: CreateLocalBusinessDto) {
    const category = dto.category?.trim() || null;
    if (category) await this.ensureCategoryExists(category);

    return this.repo.save(
      this.repo.create({
        title: dto.title.trim(),
        description: dto.description,
        imageUrl: dto.imageUrl.trim(),
        contact: dto.contact.trim(),
        location: dto.location.trim(),
        category,
        email: dto.email?.trim() || null,
        instagram: dto.instagram?.trim() || null,
        facebook: dto.facebook?.trim() || null,
        site: dto.site?.trim() || null,
        youtube: dto.youtube?.trim() || null,
        published: dto.published ?? true,
      }),
    );
  }

  async update(id: string, dto: UpdateLocalBusinessDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Comércio não encontrado');
    if (dto.title !== undefined) row.title = dto.title.trim();
    if (dto.description !== undefined) row.description = dto.description;
    if (dto.imageUrl !== undefined) row.imageUrl = dto.imageUrl.trim();
    if (dto.contact !== undefined) row.contact = dto.contact.trim();
    if (dto.location !== undefined) row.location = dto.location.trim();
    if (dto.category !== undefined) {
      const nextCategory = dto.category.trim() || null;
      if (nextCategory) await this.ensureCategoryExists(nextCategory);
      row.category = nextCategory;
    }
    if (dto.email !== undefined) row.email = dto.email.trim() || null;
    if (dto.instagram !== undefined) row.instagram = dto.instagram.trim() || null;
    if (dto.facebook !== undefined) row.facebook = dto.facebook.trim() || null;
    if (dto.site !== undefined) row.site = dto.site.trim() || null;
    if (dto.youtube !== undefined) row.youtube = dto.youtube.trim() || null;
    if (dto.published !== undefined) row.published = dto.published;
    return this.repo.save(row);
  }

  async remove(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Comércio não encontrado');
    return { ok: true };
  }

  private findCategoryByNameInsensitive(name: string) {
    return this.categoryRepo
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name })
      .getOne();
  }

  private async ensureCategoryExists(name: string) {
    const exists = await this.findCategoryByNameInsensitive(name);
    if (!exists) throw new BadRequestException('Categoria inválida para o guia local');
  }
}
