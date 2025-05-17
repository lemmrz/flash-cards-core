import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDeckDto {
  @ApiProperty({
    example: 'Biology Basics',
    description: 'The name of the deck',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(48, { message: 'Name must not exceed 48 characters' })
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Relation to subjects table',
  })
  @IsNotEmpty({ message: 'subjectId is required' })
  @IsNumber()
  subjectId: number;

  @ApiPropertyOptional({
    example: 'Covers cell structures and DNA fundamentals',
    description: 'An optional description of the deck',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;
}
