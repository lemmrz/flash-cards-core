import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiPropertyOptional({
    example: 'Updated Math',
    description: 'The updated name of the subject',
  })
  @IsString()
  @MaxLength(48, { message: 'Name must not exceed 48 characters' })
  name?: string;

  @ApiPropertyOptional({
    example: 'Advanced topics in algebra and geometry',
    description: 'An optional updated description of the subject',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description?: string;
}
