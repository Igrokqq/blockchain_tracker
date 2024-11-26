import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { pick, omit } from 'lodash';
import { Request } from 'express'
import AuthConfig from 'src/common/config/auth';
import HasherService from 'src/common/modules/hasher/hasher.service';
import UserService from 'src/modules/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignInResponseDto } from './dto';
import JwtPayloadDto from './dto/jwt-payload.dto';
import { RedisService } from '../redis/redis.service';
import { UserTokenObject } from 'src/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly authConfig: AuthConfig,
    private hasherService: HasherService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user with ${email} email`)
    }

    if (!signInDto.passwordlessAuth) {
      const passwordValid = await this.hasherService.compare(
        password,
        user.password,
      );

      if (!passwordValid) {
        throw new BadRequestException('Invalid password')
      }
    }

    const payload: JwtPayloadDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.firstName
    };

    delete user.password;

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.authConfig.refreshSecret,
      expiresIn: this.authConfig.jwtRefreshExpire,
    });

    await this.redisService.addUserRefreshToken(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.authConfig.accessSecret,
        expiresIn: this.authConfig.jwtAccessExpire,
      }),
      refresh_token: refreshToken,
      user: await this.userService.getUserById(user.id)
    };
  }

  async getMe(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getUserById(id)


    if (!user) {
      throw new NotFoundException(`No user with ${id} id`)
    }


    delete user.password;

    return user;
  }

  getUserFromToken(req: Request): UserTokenObject {
    const token = req.headers.authorization.split(' ')[1];
    const user = this.jwtService.decode(token) as UserTokenObject;
    return user;
  }

  parseToken(token: string): UserTokenObject {
    const user = this.jwtService.decode(token) as UserTokenObject;
    return user;
  }
}
