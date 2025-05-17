import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CardResponse {
  @ApiProperty({ example: 17, description: 'Unique identifier of the card' })
  id: number;

  @ApiProperty({ example: 'What is 7 × 8?', description: 'Question text' })
  question: string;

  @ApiProperty({ example: '56', description: 'Answer text' })
  answer: string;

  @ApiProperty({ example: 12, description: 'Deck ID' })
  deckId: number;

  @ApiProperty({ example: 3, description: 'Owner (user) ID' })
  ownerId: number;

  @ApiPropertyOptional({
    example: 'http:localhost/cards/card-images/42-1715940100000-math.png',
    description: 'Public URL of the card image (null if no image uploaded)',
  })
  imgUrl: string | null;
}
