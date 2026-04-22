import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubgModule } from 'pubg-kit/nestjs';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PubgModule.withConfig(),
    PlayerModule,
  ],
})
export class AppModule {}
