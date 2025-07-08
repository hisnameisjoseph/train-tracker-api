import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StationModule } from './station/station.module';
import { DepartureModule } from './departure/departure.module';
import { PtvModule } from './ptv/ptv.module';

// Added imports
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Station } from './station/entities/station.entity';
import { Departure } from './departure/entities/departure.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Station, Departure],
        synchronize: true, // TEMP for dev only
      }),
      inject: [ConfigService],
    }), 
    StationModule, 
    DepartureModule,
    PtvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


