import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartureDto } from './dto/create-departure.dto';
import { UpdateDepartureDto } from './dto/update-departure.dto';
import { Departure } from './entities/departure.entity';
import { StationService } from '../station/station.service';

@Injectable()
export class DepartureService {
  constructor(
    @InjectRepository(Departure)
    private readonly departureRepository: Repository<Departure>,
    private readonly stationService: StationService,
  ) {}

  async create(createDepartureDto: CreateDepartureDto): Promise<Departure> {
    const { stationId, ...departureData } = createDepartureDto;
    
    // Verify that the station exists
    const station = await this.stationService.findOne(stationId);
    
    const departure = this.departureRepository.create({
      ...departureData,
      station,
      scheduledDepartureUtc: new Date(createDepartureDto.scheduledDepartureUtc),
      estimatedDepartureUtc: createDepartureDto.estimatedDepartureUtc 
        ? new Date(createDepartureDto.estimatedDepartureUtc) 
        : undefined,
    });
    
    return await this.departureRepository.save(departure);
  }

  async findAll(): Promise<Departure[]> {
    return await this.departureRepository.find({
      relations: ['station'],
      order: { scheduledDepartureUtc: 'ASC' },
    });
  }

  async findByStationId(stationId: number): Promise<Departure[]> {
    return await this.departureRepository.find({
      where: { station: { id: stationId } },
      relations: ['station'],
      order: { scheduledDepartureUtc: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Departure> {
    const departure = await this.departureRepository.findOne({
      where: { id },
      relations: ['station'],
    });
    
    if (!departure) {
      throw new NotFoundException(`Departure with ID ${id} not found`);
    }
    
    return departure;
  }

  async update(id: number, updateDepartureDto: UpdateDepartureDto): Promise<Departure> {
    const departure = await this.findOne(id);
    
    if (updateDepartureDto.stationId) {
      const station = await this.stationService.findOne(updateDepartureDto.stationId);
      departure.station = station;
    }
    
    if (updateDepartureDto.scheduledDepartureUtc) {
      departure.scheduledDepartureUtc = new Date(updateDepartureDto.scheduledDepartureUtc);
    }
    
    if (updateDepartureDto.estimatedDepartureUtc) {
      departure.estimatedDepartureUtc = new Date(updateDepartureDto.estimatedDepartureUtc);
    }
    
    Object.assign(departure, {
      direction: updateDepartureDto.direction ?? departure.direction,
      platform: updateDepartureDto.platform ?? departure.platform,
    });
    
    return await this.departureRepository.save(departure);
  }

  async remove(id: number): Promise<void> {
    const departure = await this.findOne(id);
    await this.departureRepository.remove(departure);
  }
}
