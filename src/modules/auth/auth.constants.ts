import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';

export interface JwtPayload {
  sub: number;
  email: string;
}

export class JwtResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived token used to authenticate API requests',
  })
  accessToken: string;

  @ApiProperty({
    example: 'dGhpc0lzQVNlcmlhbGl6ZWRMb25nZXJTZXRTdHJpbmc...',
    description: 'Long-lived token used to obtain new access tokens',
  })
  refreshToken: string;
}
