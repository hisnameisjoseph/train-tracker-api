import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { StationService } from '../station/station.service';
import { PtvService } from '../ptv/ptv.service';
import { Station } from '../station/entities/station.entity';

/**
 * This script ensures all required stations exist and fetches their departures
 */
async function bootstrap() {
  try {
    // Create NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the station service from the app
    const stationService = app.get(StationService);
    const ptvService = app.get(PtvService);
    
    // Define our required stations
    const requiredStations = [
      { name: 'Flinders Street', ptvStationId: 1071 },
      { name: 'Melbourne Central', ptvStationId: 1120 },
      { name: 'South Yarra', ptvStationId: 1180 },
      { name: 'Richmond', ptvStationId: 1162 },
      { name: 'Parliament', ptvStationId: 1155 },
      { name: 'Southern Cross', ptvStationId: 1181 },
    ];
    
    // First, log existing stations
    console.log('Existing stations:');
    const existingStations = await stationService.findAll();
    console.log(existingStations.map(s => ({ id: s.id, name: s.name, ptvStationId: s.ptvStationId })));
    
    // Add any missing stations
    console.log('Ensuring all required stations exist...');
    const existingPtvIds = existingStations.map(s => s.ptvStationId);
    
    for (const station of requiredStations) {
      if (!existingPtvIds.includes(station.ptvStationId)) {
        const savedStation = await stationService.create(station);
        console.log(`Added missing station: ${savedStation.name} with PTV ID ${savedStation.ptvStationId}`);
      } else {
        console.log(`Station with PTV ID ${station.ptvStationId} already exists.`);
      }
    }
    
    // Get updated station list
    const updatedStations = await stationService.findAll();
    
    // Fetch fresh departures for all stations
    console.log('Fetching fresh departures for all stations...');
    for (const station of updatedStations) {
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
