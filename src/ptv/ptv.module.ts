import { Module } from '@nestjs/common';
import { PtvService } from './ptv.service';
import { PtvController } from './ptv.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from '../station/entities/station.entity';
import { Departure } from '../departure/entities/departure.entity';

// PTV Module for handling Public Transport Victoria API integration
@Module({
  controllers: [PtvController],
  providers: [PtvService],
  exports: [PtvService],
  imports: [
    TypeOrmModule.forFeature([Station, Departure]),
  ],
})
export class PtvModule {}
