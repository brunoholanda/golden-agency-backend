import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateLocalBusinessCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}
