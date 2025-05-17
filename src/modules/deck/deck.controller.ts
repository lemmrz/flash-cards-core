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
import { DeckService } from './deck.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/common.types';
import { DeckResponse } from './entities/deck-response.entity';

@ApiTags('decks')
@ApiBearerAuth()
@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @ApiOperation({ summary: 'Create a new deck' })
  @ApiBody({
    description: 'Payload to create a new deck',
    type: CreateDeckDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Deck successfully created',
    type: DeckResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createDeckDto: CreateDeckDto,
    @Request() req: RequestWithUser,
  ): Promise<DeckResponse> {
    return this.deckService.create(createDeckDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all decks for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of decks retrieved successfully',
    type: DeckResponse,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: RequestWithUser): Promise<DeckResponse[]> {
    return this.deckService.findAll(req.user.userId);
  }

  @ApiOperation({
    summary: 'Get decks by subject ID for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Decks filtered by subject retrieved successfully',
    type: DeckResponse,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get('subject/:subjectId')
  findBySubject(
    @Param('subjectId') subjectId: string,
    @Request() req: RequestWithUser,
  ): Promise<DeckResponse[]> {
    return this.deckService.findBySubject(+subjectId, req.user.userId);
  }

  @ApiOperation({ summary: 'Get a specific deck by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deck retrieved successfully',
    type: DeckResponse,
  })
  @ApiResponse({ status: 404, description: 'Deck not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<DeckResponse | null> {
    return this.deckService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a specific deck by ID' })
  @ApiBody({
    description: 'Payload to update a deck',
    type: UpdateDeckDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Deck updated successfully',
    type: DeckResponse,
  })
  @ApiResponse({ status: 404, description: 'Deck not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
    @Request() req: RequestWithUser,
  ): Promise<DeckResponse> {
    return this.deckService.update(+id, updateDeckDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete a specific deck by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deck deleted successfully',
    type: DeckResponse,
  })
  @ApiResponse({ status: 404, description: 'Deck not found' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<DeckResponse> {
    return this.deckService.remove(+id, req.user.userId);
  }
}
