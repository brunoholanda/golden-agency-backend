import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalBusiness } from '../entities/local-business.entity';
import { CreateLocalBusinessDto } from './dto/create-local-business.dto';
import { UpdateLocalBusinessDto } from './dto/update-local-business.dto';

@Injectable()
export class LocalGuideService {
  constructor(@InjectRepository(LocalBusiness) private readonly repo: Repository<LocalBusiness>) {}

  listPublic() {
    return this.repo.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'title', 'description', 'imageUrl', 'contact', 'location', 'createdAt'],
    });
  }

  async getPublic(id: string) {
    const row = await this.repo.findOne({ where: { id, published: true } });
    if (!row) throw new NotFoundException('Comércio não encontrado');
    return row;
  }

  listAdmin() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async getAdminById(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Comércio não encontrado');
    return row;
  }

  create(dto: CreateLocalBusinessDto) {
    return this.repo.save(
      this.repo.create({
        title: dto.title.trim(),
        description: dto.description,
        imageUrl: dto.imageUrl.trim(),
        contact: dto.contact.trim(),
        location: dto.location.trim(),
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
    if (dto.published !== undefined) row.published = dto.published;
    return this.repo.save(row);
  }

  async remove(id: string) {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Comércio não encontrado');
    return { ok: true };
  }
}
