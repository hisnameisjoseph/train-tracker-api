import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DepartureService } from './departure.service';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { UpdateDepartureDto } from './dto/update-departure.dto';
import { Departure } from './entities/departure.entity';

@Controller('departure')
export class DepartureController {
  constructor(
    private readonly departureService: DepartureService,
  ) {}

  @Get()
  findAll() {
    return this.departureService.findAll();
  }

  @Post()
  async create(@Body() createDepartureDto: CreateDepartureDto): Promise<Departure> {
    return await this.departureService.create(createDepartureDto);
  }

  @Get('station/:stationId')
  async findByStationId(@Param('stationId', ParseIntPipe) stationId: number): Promise<Departure[]> {
    return await this.departureService.findByStationId(stationId);
  }

  @Get('ptv/:ptvStationId')
  async findByPtv(
    @Param('ptvStationId', ParseIntPipe) ptvStationId: number,
  ): Promise<Departure[]> {
    return await this.departureService.findByPtvStation(ptvStationId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Departure> {
    return await this.departureService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDepartureDto: UpdateDepartureDto
  ): Promise<Departure> {
    return await this.departureService.update(id, updateDepartureDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.departureService.remove(id);
  }
}
