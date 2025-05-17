import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubjectResponse } from 'src/modules/subject/entities/subject-response.entity';

export class DeckResponse {
  @ApiProperty({
    example: 42,
    description: 'Unique identifier of the deck',
  })
  id: number;

  @ApiProperty({
    example: 'Math Basics',
    description: 'The name of the deck',
  })
  name: string;

  @ApiProperty({
    example: 7,
    description: 'Identifier of the user that owns this deck',
  })
  ownerId: number;

  @ApiPropertyOptional({
    example: 'Covers math fundamentals',
    description: 'Optional description of the deck',
  })
  description: string | null;

  @ApiProperty({
    description: 'The subject this deck belongs to',
    type: SubjectResponse,
  })
  subject: SubjectResponse;
}
