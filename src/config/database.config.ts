import { DataSource, DataSourceOptions } from 'typeorm';
import { registerAs } from '@nestjs/config';

// Shared database configuration
const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'asset_management',
  entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: true,
};

// Configuration for NestJS
export default registerAs('database', (): DataSourceOptions => databaseConfig);

// DataSource instance for TypeORM CLI
export const AppDataSource = new DataSource(databaseConfig);
