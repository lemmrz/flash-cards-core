import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      this.logger.error(`User with email ${email} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { email, password, name } = dto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      this.logger.error(`User with email ${email} already exists`);
      throw new ConflictException(`User with email ${email} already exists`)
    }
   return await this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }
}
