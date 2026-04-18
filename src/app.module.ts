import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { BlogPost } from './entities/blog-post.entity';
import { LocalBusiness } from './entities/local-business.entity';
import { User } from './entities/user.entity';
import { LocalGuideModule } from './local-guide/local-guide.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(config.get<string>('DATABASE_PORT', '5432')),
        username: config.get<string>('DATABASE_USER', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD', ''),
        database: config.get<string>('DATABASE_NAME', 'gondeagencia'),
        entities: [User, BlogPost, LocalBusiness],
        synchronize: config.get<string>('TYPEORM_SYNC', 'true') === 'true',
        logging: config.get<string>('TYPEORM_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BlogModule,
    LocalGuideModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}
