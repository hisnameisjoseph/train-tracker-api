import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { Station } from './entities/station.entity';
import { PtvModule } from '../ptv/ptv.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
    PtvModule,
  ],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
