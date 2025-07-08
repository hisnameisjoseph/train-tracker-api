const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

module.exports = { AppDataSource };
