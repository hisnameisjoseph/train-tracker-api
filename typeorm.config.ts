import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Station } from './src/station/entities/station.entity';
import { Departure } from './src/departure/entities/departure.entity';

config(); // Load .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Station, Departure],
  migrations: ['./src/migrations/*.ts'],
});