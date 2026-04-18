import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthSeedService implements OnModuleInit {
  private readonly log = new Logger(AuthSeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.users.count();
    if (count > 0) return;
    const email = (this.config.get<string>('ADMIN_EMAIL') || 'admin@goldenagencia.com').toLowerCase();
    const password = this.config.get<string>('ADMIN_PASSWORD') || 'AltereEstaSenha123!';
    const hash = await bcrypt.hash(password, 10);
    await this.users.save(
      this.users.create({
        email,
        passwordHash: hash,
        name: 'Administrador',
      }),
    );
    this.log.warn(`Usuario admin criado: ${email}. Defina ADMIN_PASSWORD no .env em producao.`);
  }
}
