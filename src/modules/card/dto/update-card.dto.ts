import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @ApiPropertyOptional({
    example: 'What is 9 × 6?',
    description: 'Updated question text',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  question?: string;

  @ApiPropertyOptional({ example: '54', description: 'Updated answer text' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  answer?: string;

  @ApiPropertyOptional({ example: 12, description: 'Deck ID' })
  @IsInt()
  @IsOptional()
  deckId?: number;
}
