import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  offerSkills?: string[];

  @IsOptional()
  @IsArray()
  wantSkills?: string[];

  @IsOptional()
  @IsString()
  website?: string;
}
