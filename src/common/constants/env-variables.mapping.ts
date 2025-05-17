export interface EnvInterface {
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    refreshExpiresInDays: string;
  };
  s3: {
    endpoint: string;
    port: string;
    accessKey: string;
    secretKey: string;
    region: string;
    useSsl: string;
  };
}

export const envVars: EnvInterface = {
  jwt: {
    accessSecret: 'JWT_ACCESS_SECRET',
    refreshSecret: 'JWT_REFRESH_SECRET',
    expiresIn: 'JWT_ACCESS_EXPIRES_IN',
    refreshExpiresIn: 'JWT_REFRESH_EXPIRES_IN',
    refreshExpiresInDays: 'JWT_REFRESH_EXPIRES_IN_DAYS',
  },
  s3: {
    endpoint: 'S3_ENDPOINT',
    port: 'S3_PORT',
    accessKey: 'S3_ACCESS_KEY_ID',
    secretKey: 'S3_SECRET_KEY',
    region: 'S3_REGION',
    useSsl: 'S3_USE_SSL'
  },
};
