import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

/** Lista de origens a partir de CORS_ORIGINS (virgulas); vazio/absente = refletir qualquer origem (util em dev). */
function parseCorsOrigins(): string[] | true {
  const raw = process.env.CORS_ORIGINS?.replace(/^\uFEFF/, '');
  if (raw === undefined || raw.trim() === '') return true;
  const list = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return list.length > 0 ? list : true;
}

function buildCorsOptions(): CorsOptions {
  const allowed = parseCorsOrigins();
  return {
    origin:
      allowed === true
        ? true
        : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            if (!origin) {
              callback(null, true);
              return;
            }
            callback(null, allowed.includes(origin));
          },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    optionsSuccessStatus: 204,
  };
}

async function bootstrap() {
  mkdirSync(join(process.cwd(), 'uploads'), { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(buildCorsOptions());

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
}
bootstrap();
