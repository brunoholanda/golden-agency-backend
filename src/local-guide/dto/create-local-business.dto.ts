import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLocalBusinessDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  imageUrl!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  contact!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  location!: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
