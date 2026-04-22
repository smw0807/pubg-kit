import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { type PlatformShard } from 'pubg-kit';

@ApiTags('Players')
@ApiBearerAuth('pubg-api-key')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('search')
  @ApiOperation({
    summary: '닉네임으로 플레이어 검색',
    description: '최대 10명까지 검색 가능. 쉼표로 구분.',
  })
  @ApiQuery({ name: 'names', description: '플레이어 닉네임 (쉼표 구분)', example: 'shroud,DrDisrespect' })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '플레이어 목록 반환' })
  @ApiResponse({ status: 404, description: '플레이어를 찾을 수 없음' })
  getByNames(
    @Query('names') names: string,
    @Query('platform') platform: PlatformShard = 'steam',
  ) {
    return this.playerService.getByNames(names.split(','), platform);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Account ID로 플레이어 조회',
    description: 'account.xxxx 형식의 고유 ID로 조회',
  })
  @ApiParam({ name: 'id', description: '플레이어 Account ID', example: 'account.0000000000000000000000000000000' })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '플레이어 정보 반환' })
  @ApiResponse({ status: 404, description: '플레이어를 찾을 수 없음' })
  getById(
    @Param('id') id: string,
    @Query('platform') platform: PlatformShard = 'steam',
  ) {
    return this.playerService.getById(id, platform);
  }

  @Get(':id/lifetime')
  @ApiOperation({
    summary: '전체 기간 누적 스탯 조회',
    description: '플레이어의 전체 기간 누적 통계를 반환',
  })
  @ApiParam({ name: 'id', description: '플레이어 Account ID' })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '누적 스탯 반환' })
  getLifetimeStats(
    @Param('id') id: string,
    @Query('platform') platform: PlatformShard = 'steam',
  ) {
    return this.playerService.getLifetimeStats(id, platform);
  }

  @Get(':id/seasons/:seasonId')
  @ApiOperation({
    summary: '특정 시즌 스탯 조회',
    description: '플레이어의 특정 시즌 통계를 반환',
  })
  @ApiParam({ name: 'id', description: '플레이어 Account ID' })
  @ApiParam({ name: 'seasonId', description: '시즌 ID', example: 'division.bro.official.pc-2018-01' })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '시즌 스탯 반환' })
  getSeasonStats(
    @Param('id') id: string,
    @Param('seasonId') seasonId: string,
    @Query('platform') platform: PlatformShard = 'steam',
  ) {
    return this.playerService.getSeasonStats(id, seasonId, platform);
  }
}

@ApiTags('Seasons')
@ApiBearerAuth('pubg-api-key')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  @ApiOperation({
    summary: '전체 시즌 목록 조회',
    description: '해당 플랫폼의 모든 시즌 목록을 반환',
  })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '시즌 목록 반환' })
  getAll(@Query('platform') platform: PlatformShard = 'steam') {
    return this.playerService.getSeasons(platform);
  }
}

@ApiTags('Matches')
@ApiBearerAuth('pubg-api-key')
@Controller('matches')
export class MatchesController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':matchId')
  @ApiOperation({
    summary: '매치 상세 데이터 조회',
    description: '특정 매치의 상세 데이터를 반환 (로스터, 참가자 포함)',
  })
  @ApiParam({ name: 'matchId', description: '매치 ID' })
  @ApiQuery({
    name: 'platform',
    enum: ['steam', 'kakao', 'xbox', 'psn', 'console', 'tournament', 'stadia'],
    example: 'steam',
  })
  @ApiResponse({ status: 200, description: '매치 데이터 반환' })
  @ApiResponse({ status: 404, description: '매치를 찾을 수 없음' })
  getMatch(
    @Param('matchId') matchId: string,
    @Query('platform') platform: PlatformShard = 'steam',
  ) {
    return this.playerService.getMatch(matchId, platform);
  }
}
