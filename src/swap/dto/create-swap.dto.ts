import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSwapDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  receiver_id: string;
}