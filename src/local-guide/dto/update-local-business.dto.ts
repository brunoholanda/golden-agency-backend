import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  @IsBoolean()
  published?: boolean;
}
