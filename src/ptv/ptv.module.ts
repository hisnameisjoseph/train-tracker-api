import { Module } from '@nestjs/common';
import { PtvService } from './ptv.service';
import { PtvController } from './ptv.controller';

// PTV Module for handling Public Transport Victoria API integration
@Module({
  controllers: [PtvController],
  providers: [PtvService],
  exports: [PtvService],
})
export class PtvModule {}
