import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'prisma/prisma.service';
import { SubjectResponse } from './entities/subject-response.entity';
import { Prisma } from '@prisma/client';

export const subjectDefaultSelect: Prisma.SubjectSelect = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
};

@Injectable()
export class SubjectService {
  private readonly logger = new Logger(SubjectService.name);
  private readonly defaultSelect = subjectDefaultSelect;

  constructor(private prismaService: PrismaService) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    ownerId: number,
  ): Promise<SubjectResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: ownerId,
      },
    });
    if (!user) {
      this.logger.error(`User with ID ${ownerId} not found`);
      throw new Error('User not found');
    }
    return await this.prismaService.subject.create({
      data: {
        ...createSubjectDto,
        ownerId,
      },
      select: this.defaultSelect,
    });
  }

  async findAll(ownerId: number): Promise<SubjectResponse[]> {
    return this.prismaService.subject.findMany({
      where: {
        ownerId,
      },
      select: this.defaultSelect,
    });
  }

  async findOne(id: number): Promise<SubjectResponse | null> {
    return this.prismaService.subject.findUnique({
      where: {
        id,
      },
      select: this.defaultSelect,
    });
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
    userId: number,
  ): Promise<SubjectResponse> {
    const subject = await this.findOne(id);
    if (!subject) {
      this.logger.error(`Subject with ID ${id} not found`);
      throw new NotFoundException('Subject not found');
    }
    if (subject.ownerId !== userId) {
      this.logger.error(
        `User with ID ${userId} is not authorized to update subject with ID ${id}`,
      );
      throw new UnauthorizedException(
        `User with ID ${userId} is not authorized to update subject with ID ${id}`,
      );
    }
    return this.prismaService.subject.update({
      where: {
        id,
      },
      data: { ...updateSubjectDto },
      select: this.defaultSelect,
    });
  }

  async remove(id: number, userId: number): Promise<SubjectResponse> {
    const subject = await this.findOne(id);
    if (!subject) {
      this.logger.error(`Subject with ID ${id} not found`);
      throw new Error('Subject not found');
    }
    if (subject.ownerId !== userId) {
      this.logger.error(
        `User with ID ${userId} is not authorized to delete subject with ID ${id}`,
      );
      throw new UnauthorizedException(
        `User with ID ${userId} is not authorized to delete subject with ID ${id}`,
      );
    }
    return this.prismaService.subject.delete({
      where: {
        id,
      },
      select: this.defaultSelect,
    });
  }
}
