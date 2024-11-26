import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { OffJwtAccess } from 'src/common/decorators/off-jwt-access.decorator';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '@songkeys/nestjs-redis';
import HasherService from '../hasher/hasher.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TokenPayload, UserTokenObject } from 'src/common/interfaces';
import { AuthService } from './auth.service';
import { SignInDto, SignInResponseDto } from './dto';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly userAuthService: AuthService,
    private readonly hasherService: HasherService,
    private moduleRef: ModuleRef,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @OffJwtAccess()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(@CurrentUser() user: TokenPayload, @Req() req: Request) {
    const payload = {
      email: user.email,
      passwordlessAuth: true,
    } as SignInDto;
    return this.userAuthService.signIn(payload)
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(
    @Body() signInDto: SignInDto,
    @Req() req: Request,
  ): Promise<SignInResponseDto> {
    return this.userAuthService.signIn(signInDto);
  }

  @Get('me')
  async getMeFactory(@CurrentUser() user: UserTokenObject): Promise<any> {
    const { id } = user;

    // check if token is passed
    if (!id) {
      throw new Error('Token is not passed');
    }

    return this.userAuthService.getMe(id);
  }
}
