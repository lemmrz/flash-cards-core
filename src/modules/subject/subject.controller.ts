import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/common.types';
import { Subject } from '@prisma/client';
import { SubjectResponse } from './entities/subject-response.entity';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({
    description: 'Payload to create a new subject',
    type: CreateSubjectDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Subject successfully created',
    type: SubjectResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Request() req: RequestWithUser,
  ): Promise<SubjectResponse> {
    return this.subjectService.create(createSubjectDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all subjects for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of subjects retrieved successfully',
    type: SubjectResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: RequestWithUser): Promise<SubjectResponse[]> {
    const userId = req.user.userId;
    return this.subjectService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a specific subject by ID' })
  @ApiResponse({
    status: 200,
    description: 'Subject retrieved successfully',
    type: SubjectResponse,
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<SubjectResponse | null> {
    return this.subjectService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a specific subject by ID' })
  @ApiBody({
    description: 'Payload to update a subject',
    type: UpdateSubjectDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Subject updated successfully',
    type: SubjectResponse,
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Request() req: RequestWithUser,
  ): Promise<SubjectResponse> {
    const userId = req.user.userId;
    return this.subjectService.update(+id, updateSubjectDto, userId);
  }

  @ApiOperation({ summary: 'Delete a specific subject by ID' })
  @ApiResponse({
    status: 200,
    description: 'Subject deleted successfully',
    type: SubjectResponse,
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<SubjectResponse> {
    const userId = req.user.userId;
    return this.subjectService.remove(+id, userId);
  }
}
