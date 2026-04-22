import { Module } from '@nestjs/common';
import { PlayerController, SeasonsController, MatchesController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  controllers: [PlayerController, SeasonsController, MatchesController],
  providers: [PlayerService],
})
export class PlayerModule {}
