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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/common.types';
import { CardResponse } from './entities/card-response.entity';
import { ImageFileInterceptor } from 'src/common/interceptors/image-file.interceptor';

@ApiTags('cards')
@ApiBearerAuth()
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  /* ------------------------------------------------------------------ */
  /*  Create                                                            */
  /* ------------------------------------------------------------------ */
  @ApiOperation({ summary: 'Create a new card' })
  @ApiBody({ type: CreateCardDto, description: 'Payload to create a card' })
  @ApiResponse({
    status: 201,
    type: CardResponse,
    description: 'Card created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateCardDto,
    @Request() req: RequestWithUser,
  ): Promise<CardResponse> {
    return this.cardService.create(dto, req.user.userId) as any;
  }

  /* ------------------------------------------------------------------ */
  /*  Get all cards in a deck                                           */
  /* ------------------------------------------------------------------ */
  @ApiOperation({ summary: 'Get all cards in a deck (owned by user)' })
  @ApiResponse({ status: 200, type: CardResponse, isArray: true })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get('deck/:deckId')
  findAll(
    @Param('deckId') deckId: string,
    @Request() req: RequestWithUser,
  ): Promise<CardResponse[]> {
    return this.cardService.findAll(+deckId, req.user.userId) as any;
  }

  /* ------------------------------------------------------------------ */
  /*  Get one card                                                      */
  /* ------------------------------------------------------------------ */
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiResponse({ status: 200, type: CardResponse })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CardResponse | null> {
    return this.cardService.findOne(+id) as any;
  }

  /* ------------------------------------------------------------------ */
  /*  Update                                                            */
  /* ------------------------------------------------------------------ */
  @ApiOperation({ summary: 'Update a card' })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, type: CardResponse })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
    @Request() req: RequestWithUser,
  ): Promise<CardResponse> {
    return this.cardService.update(+id, dto, req.user.userId) as any;
  }

  /* ------------------------------------------------------------------ */
  /*  Delete                                                            */
  /* ------------------------------------------------------------------ */
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, type: CardResponse })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<CardResponse> {
    return this.cardService.remove(+id, req.user.userId) as any;
  }

  /* ------------------------------------------------------------------ */
  /*  Upload fie                                                       */
  /* ------------------------------------------------------------------ */
  @ApiOperation({
    summary:
      'Upload image for card. If current card already has a saved image - previously added picture would be removed. 1 card - 1 image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post('upload-image/:id')
  @UseInterceptors(ImageFileInterceptor('file', 4))
  async uploadImage(
    @Param('id') cardId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    console.log('asdf')
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const imageUrl = await this.cardService.uploadCardImage(
      +cardId,
      file,
      req.user.userId,
    );

    return { imageUrl };
  }
}
