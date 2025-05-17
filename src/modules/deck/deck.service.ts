import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DeckResponse } from './entities/deck-response.entity';
import { Prisma } from '@prisma/client';
import { subjectDefaultSelect } from '../subject/subject.service';

export const deckDefaultSelect: Prisma.DeckSelect = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  subject: {
    select: subjectDefaultSelect,
  },
};

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name);

  private readonly defaultSelect: Prisma.DeckSelect = deckDefaultSelect;

  constructor(private prismaService: PrismaService) {}

  async create(
    createDeckDto: CreateDeckDto,
    ownerId: number,
  ): Promise<DeckResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { id: ownerId },
    });
    if (!user) {
      this.logger.error(`User with ID ${ownerId} not found`);
      throw new NotFoundException('User not found');
    }

    return this.prismaService.deck.create({
      data: {
        ...createDeckDto,
        ownerId,
      },
      select: this.defaultSelect,
    });
  }

  async findAll(ownerId: number): Promise<DeckResponse[]> {
    return this.prismaService.deck.findMany({
      where: { ownerId },
      select: this.defaultSelect,
    });
  }

  async findBySubject(
    subjectId: number,
    ownerId: number,
  ): Promise<DeckResponse[]> {
    return this.prismaService.deck.findMany({
      where: {
        subjectId,
        ownerId,
      },
      select: this.defaultSelect,
    });
  }

  async findOne(id: number): Promise<DeckResponse | null> {
    return this.prismaService.deck.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
  }

  async update(
    id: number,
    updateDeckDto: UpdateDeckDto,
    ownerId: number,
  ): Promise<DeckResponse> {
    const deck = await this.findOne(id);
    if (!deck) {
      this.logger.error(`Deck with ID ${id} not found`);
      throw new NotFoundException('Deck not found');
    }

    if (deck.ownerId !== ownerId) {
      this.logger.error(
        `User with ID ${ownerId} is not authorized to update deck with ID ${id}`,
      );
      throw new UnauthorizedException(
        `User with ID ${ownerId} is not authorized to update this deck`,
      );
    }

    return this.prismaService.deck.update({
      where: { id },
      data: updateDeckDto,
      select: this.defaultSelect,
    });
  }

  async remove(id: number, ownerId: number): Promise<DeckResponse> {
    const deck = await this.findOne(id);
    if (!deck) {
      this.logger.error(`Deck with ID ${id} not found`);
      throw new NotFoundException('Deck not found');
    }

    if (deck.ownerId !== ownerId) {
      this.logger.error(
        `User with ID ${ownerId} is not authorized to delete deck with ID ${id}`,
      );
      throw new UnauthorizedException(
        `User with ID ${ownerId} is not authorized to delete this deck`,
      );
    }

    return this.prismaService.deck.delete({
      where: { id },
      select: this.defaultSelect,
    });
  }
}
