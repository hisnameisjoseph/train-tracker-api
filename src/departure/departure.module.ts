import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartureService } from './departure.service';
import { DepartureController } from './departure.controller';
import { Departure } from './entities/departure.entity';
import { StationModule } from '../station/station.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departure]),
    StationModule,
  ],
  controllers: [DepartureController],
  providers: [DepartureService],
  exports: [DepartureService],
})
export class DepartureModule {}
