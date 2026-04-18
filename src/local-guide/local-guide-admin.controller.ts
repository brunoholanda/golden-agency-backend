import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateLocalBusinessDto } from './dto/create-local-business.dto';
import { UpdateLocalBusinessDto } from './dto/update-local-business.dto';
import { LocalGuideService } from './local-guide.service';

@Controller('admin/local-guide')
@UseGuards(AuthGuard('jwt'))
export class LocalGuideAdminController {
  constructor(private readonly guide: LocalGuideService) {}

  @Get()
  list() {
    return this.guide.listAdmin();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.guide.getAdminById(id);
  }

  @Post()
  create(@Body() dto: CreateLocalBusinessDto) {
    return this.guide.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLocalBusinessDto) {
    return this.guide.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guide.remove(id);
  }
}
