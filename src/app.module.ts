import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CardModule } from './modules/card/card.module';
import { SubjectModule } from './modules/subject/subject.module';
import { DeckModule } from './modules/deck/deck.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CardModule,
    SubjectModule,
    DeckModule,
    UserModule,
    AuthModule,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
