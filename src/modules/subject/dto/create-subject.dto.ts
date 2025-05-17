import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Math', description: 'The name of the subject' })
  @IsString()
  @MaxLength(48, { message: 'Name must not exceed 48 characters' })
  name: string;

  @ApiProperty({
    example: 'A subject about numbers and equations',
    description: 'The description of the subject',
  })
  @IsString()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  @IsOptional()
  description?: string;
}
