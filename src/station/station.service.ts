import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './entities/station.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const station = this.stationRepository.create(createStationDto);
    return await this.stationRepository.save(station);
  }

  async findAll(): Promise<Station[]> {
    return await this.stationRepository.find({
      relations: ['departures'],
    });
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { id },
      relations: ['departures'],
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    
    return station;
  }

  async findByPtvId(ptvStationId: number): Promise<Station> {
    const station = await this.stationRepository.findOne({
      where: { ptvStationId },
      relations: ['departures'],
    });
    
    if (!station) {
      throw new NotFoundException(`Station with PTV ID ${ptvStationId} not found`);
    }
    
    return station;
  }

  async findOrCreateByPtvId(ptvStationId: number, name?: string): Promise<Station> {
    try {
      return await this.findByPtvId(ptvStationId);
    } catch (error) {
      if (error instanceof NotFoundException && name) {
        // Create the station if it doesn't exist
        const createDto: CreateStationDto = {
          name,
          ptvStationId,
        };
        return await this.create(createDto);
      }
      throw error;
    }
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.findOne(id);
    
    Object.assign(station, updateStationDto);
    return await this.stationRepository.save(station);
  }

  async remove(id: number): Promise<void> {
    const station = await this.findOne(id);
    await this.stationRepository.remove(station);
  }
}
