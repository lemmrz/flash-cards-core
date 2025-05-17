import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponse {
  @ApiProperty({ example: 1, description: 'The unique ID of the subject' })
  id: number;

  @ApiProperty({
    example: 'Mathematics',
    description: 'The name of the subject',
  })
  name: string;

  @ApiProperty({
    example: 'A subject about numbers and equations',
    description: 'The description of the subject',
  })
  description: string | null;

  @ApiProperty({
    example: 42,
    description: 'The ID of the user who owns the subject',
  })
  ownerId: number;
}
