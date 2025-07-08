import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './entities/station.entity';
import { PtvService, PtvDeparturesResponse } from '../ptv/ptv.service';

@Controller('station')
export class StationController {
  constructor(
    private readonly stationService: StationService,
    private readonly ptvService: PtvService,
  ) {}

  @Post()
  async create(@Body() createStationDto: CreateStationDto): Promise<Station> {
    return await this.stationService.create(createStationDto);
  }

  @Get()
  async findAll(): Promise<Station[]> {
    return await this.stationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Station> {
    return await this.stationService.findOne(id);
  }

  @Get('ptv/:ptvId')
  async findByPtvId(@Param('ptvId', ParseIntPipe) ptvId: number): Promise<Station> {
    return await this.stationService.findByPtvId(ptvId);
  }

  @Get(':id/live-departures')
  async getLiveDepartures(@Param('id', ParseIntPipe) id: number): Promise<PtvDeparturesResponse> {
    const station = await this.stationService.findOne(id);
    return await this.ptvService.getDepartures(station.ptvStationId, 0, 10, false);
  }

  @Get('ptv/:ptvId/live-departures')
  async getLiveDeparturesByPtvId(@Param('ptvId', ParseIntPipe) ptvId: number): Promise<PtvDeparturesResponse> {
    return await this.ptvService.getDepartures(ptvId, 0, 10, false);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateStationDto: UpdateStationDto
  ): Promise<Station> {
    return await this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.stationService.remove(id);
  }
}
