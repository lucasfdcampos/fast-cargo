import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  logging: true,
};

export const config: TypeOrmModuleOptions = {
  ...ormConfig,
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.js,.ts}'],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
};
