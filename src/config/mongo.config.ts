import { ConfigService } from '@nestjs/config';

const options = {};

export const getMongodbConfig = async (configService: ConfigService) => ({
  uri: configService.get('MONGO_URL'),
  ...options,
});
