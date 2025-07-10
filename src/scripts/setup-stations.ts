import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { StationService } from '../station/station.service';
import { PtvService } from '../ptv/ptv.service';
import { Station } from '../station/entities/station.entity';

/**
 * This script sets up the required stations and fetches their departures
 */
async function bootstrap() {
  try {
    // Create NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the station service from the app
    const stationService = app.get(StationService);
    const ptvService = app.get(PtvService);
    
    // Define our stations
    const stations = [
      { name: 'Flinders Street', ptvStationId: 1071 },
      { name: 'Melbourne Central', ptvStationId: 1120 },
      { name: 'South Yarra', ptvStationId: 1180 },
      { name: 'Richmond', ptvStationId: 1162 },
    ];
    
    // First, log existing stations
    console.log('Existing stations:');
    const existingStations = await stationService.findAll();
    console.log(existingStations);
    
    // Clear existing stations
    console.log('Clearing existing stations...');
    for (const station of existingStations) {
      await stationService.remove(station.id);
    }
    
    // Add new stations
    console.log('Adding required stations...');
    const savedStations: Station[] = [];
    for (const station of stations) {
      const savedStation = await stationService.create(station);
      savedStations.push(savedStation);
      console.log(`Added station: ${savedStation.name} with PTV ID ${savedStation.ptvStationId}`);
    }
    
    // Fetch initial departures for all stations
    console.log('Fetching initial departures for all stations...');
    for (const station of savedStations) {
      console.log(`Fetching departures for ${station.name} (PTV ID: ${station.ptvStationId})...`);
      try {
        await ptvService.getDepartures(station.ptvStationId);
        console.log(`Successfully fetched and saved departures for ${station.name}`);
      } catch (error) {
        console.error(`Error fetching departures for ${station.name}:`, error.message);
      }
    }
    
    console.log('Setup complete!');
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

bootstrap();
