import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    example: 'What is 7 × 8?',
    description: 'Front side / question text of the flash-card',
  })
  @IsString()
  @IsNotEmpty({ message: 'question is required' })
  @MaxLength(255, { message: 'question must not exceed 255 characters' })
  question: string;

  @ApiProperty({
    example: '56',
    description: 'Back side / answer text of the flash-card',
  })
  @IsString()
  @IsNotEmpty({ message: 'answer is required' })
  @MaxLength(255, { message: 'answer must not exceed 255 characters' })
  answer: string;

  @ApiProperty({
    example: 12,
    description: 'ID of the deck this card belongs to',
  })
  @IsInt({ message: 'deckId must be an integer' })
  deckId: number;
}
