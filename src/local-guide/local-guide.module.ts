import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalBusiness } from '../entities/local-business.entity';
import { LocalBusinessCategory } from '../entities/local-business-category.entity';
import { LocalGuideAdminController } from './local-guide-admin.controller';
import { LocalGuidePublicController } from './local-guide-public.controller';
import { LocalGuideService } from './local-guide.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalBusiness, LocalBusinessCategory])],
  controllers: [LocalGuidePublicController, LocalGuideAdminController],
  providers: [LocalGuideService],
})
export class LocalGuideModule {}
