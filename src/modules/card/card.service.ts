import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardResponse } from './entities/card-response.entity';
import { deckDefaultSelect } from '../deck/deck.service';
import { MinioService } from '../minio/minio.service';

export const cardDefaultSelect: Prisma.CardSelect = {
  id: true,
  question: true,
  answer: true,
  deckId: true,
  ownerId: true,
  imgUrl: true
};

export const cardsBucketName = 'cards';

@Injectable()
export class CardService {
  private readonly defaultSelect = cardDefaultSelect;
  private readonly logger = new Logger(CardService.name);

  constructor(private readonly prisma: PrismaService, private minioService: MinioService) {}

  async create(
    createCardDto: CreateCardDto,
    ownerId: number,
  ): Promise<CardResponse> {
    const deck = await this.prisma.deck.findUnique({
      where: { id: createCardDto.deckId },
      select: deckDefaultSelect,
    });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }
    if (deck.ownerId !== ownerId) {
      throw new UnauthorizedException('You do not own this deck');
    }

    return this.prisma.card.create({
      data: { ...createCardDto, ownerId },
      select: this.defaultSelect,
    });
  }

  async findAll(deckId: number, ownerId: number): Promise<CardResponse[]> {
    return this.prisma.card.findMany({
      where: { deckId, ownerId },
      select: this.defaultSelect,
    });
  }

  async findOne(id: number): Promise<CardResponse | null> {
    return this.prisma.card.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
  }

  async update(
    id: number,
    updateCardDto: UpdateCardDto,
    ownerId: number,
  ): Promise<CardResponse> {
    const card = await this.findOne(id);

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.ownerId !== ownerId) {
      throw new UnauthorizedException('You do not own this card');
    }

    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
      select: this.defaultSelect,
    });
  }

  async remove(id: number, ownerId: number): Promise<CardResponse> {
    const card = await this.findOne(id);

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.ownerId !== ownerId) {
      throw new UnauthorizedException('You do not own this card');
    }

    return this.prisma.card.delete({
      where: { id },
      select: this.defaultSelect,
    });
  }

  private async updateImageUrl(cardId: number, imageUrl: string): Promise<CardResponse> {
    const card = await this.findOne(cardId);
  
    if (!card) {
      throw new NotFoundException('Card not found');
    }
  
    return this.prisma.card.update({
      where: { id: cardId },
      data: { imgUrl: imageUrl },
      select: this.defaultSelect,
    });
  }

  async uploadCardImage(
    cardId: number,
    file: Express.Multer.File,
    ownerId: number,
  ): Promise<string> {
    const card = await this.findOne(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    if (card.ownerId !== ownerId) {
      throw new UnauthorizedException('You do not own this card');
    }
  
    if (card.imgUrl) {
      const oldKey = card.imgUrl.split('/').slice(-2).join('/');
      await this.minioService.deleteFile(cardsBucketName, oldKey);
    }
  
    const key = `card-images/${cardId}-${Date.now()}-${cardId}`;
  
    const imageUrl = await this.minioService.uploadFile(
      cardsBucketName,
      key,
      file.buffer,
      file.mimetype,
    );
  
    // Update card with new imageUrl
    await this.updateImageUrl(cardId, imageUrl);
  
    return imageUrl;
  }
  
}
