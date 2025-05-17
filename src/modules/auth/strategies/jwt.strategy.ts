import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envVars } from 'src/common/constants/env-variables.mapping';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(envVars.jwt.accessSecret) || '',
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}
