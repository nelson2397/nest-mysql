import { IsString, MinLength, IsNumber, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(3)
  firtsName: string;
  @IsString()
  @MinLength(3)
  lastname: string;
  @IsNumber()
  @IsOptional()
  age?: number;
}
