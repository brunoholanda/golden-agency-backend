import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateLocalBusinessDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  contact?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  category?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  instagram?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  facebook?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  site?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  youtube?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
