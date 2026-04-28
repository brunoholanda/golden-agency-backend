import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('local_businesses')
export class LocalBusiness {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ type: 'text' })
  contact!: string;

  @Column({ type: 'text' })
  location!: string;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  category!: string | null;

  @Column({ name: 'email', type: 'varchar', nullable: true, length: 255 })
  email!: string | null;

  @Column({ name: 'instagram', type: 'varchar', nullable: true, length: 500 })
  instagram!: string | null;

  @Column({ name: 'facebook', type: 'varchar', nullable: true, length: 500 })
  facebook!: string | null;

  @Column({ name: 'site', type: 'varchar', nullable: true, length: 500 })
  site!: string | null;

  @Column({ name: 'youtube', type: 'varchar', nullable: true, length: 500 })
  youtube!: string | null;

  @Column({ default: true })
  published!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
