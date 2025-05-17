import { IsEmail, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    maxLength: 64,
  })
  @IsEmail({}, { message: 'Invalid email' })
  @MaxLength(64, { message: 'Email must not exceed 64 characters' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    maxLength: 32,
    minLength: 4,
  })
  @MaxLength(32, { message: 'Password must not exceed 32 characters' })
  @Min(4, { message: 'Password must be at least 4 characters long' })
  password: string;
}