import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    maxLength: 48,
  })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(48, { message: 'Name must not exceed 50 characters' })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    maxLength: 256,
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(256, { message: 'Email must not exceed 255 characters' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    minLength: 6,
    maxLength: 32,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password must not exceed 32 characters' })
  password: string;
}