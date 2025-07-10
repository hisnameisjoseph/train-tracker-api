import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Departure } from '../departure/entities/departure.entity';

/**
 * This script truncates (clears) the departure table.
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('Clearing all existing departures from the database...');
    await dataSource.getRepository(Departure).clear();
    console.log('Departure table has been cleared successfully.');
  } catch (error) {
    console.error('Failed to clear the departure table:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
