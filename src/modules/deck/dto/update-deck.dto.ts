import { PartialType } from '@nestjs/mapped-types';
import { CreateDeckDto } from './create-deck.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @ApiPropertyOptional({
    example: 'Updated Biology Basics',
    description: 'Updated name of the deck',
  })
  @IsString()
  @IsOptional()
  @MaxLength(48, { message: 'Name must not exceed 48 characters' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description about cell biology and genetics',
    description: 'Updated description of the deck',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;
}
