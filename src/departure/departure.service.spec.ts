import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartureService } from './departure.service';
import { Departure } from './entities/departure.entity';
import { StationService } from '../station/station.service';
import { Station } from '../station/entities/station.entity';

describe('DepartureService', () => {
  let service: DepartureService;

  const sampleStation: Station = ({ id: 1, name: 'Test Station', ptvStationId: 999, departures: [] } as unknown) as Station;
  const sampleDeparture: Partial<Departure> = {
    id: 1,
    station: sampleStation,
    direction: '1',
    platform: '2',
    scheduledDepartureUtc: new Date('2025-07-10T01:00:00.000Z'),
    estimatedDepartureUtc: new Date('2025-07-10T01:05:00.000Z'),
    delayInMinutes: 5,
    routeId: 42,
    routeName: 'SampleLine',
    createdAt: new Date(),
  };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([sampleDeparture]),
    findOne: jest.fn().mockResolvedValue(sampleDeparture),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: function () { return this; },
      where: function () { return this; },
      orderBy: function () { return this; },
      getMany: jest.fn().mockResolvedValue([sampleDeparture]),
    }),
  } as unknown as Repository<Departure>;

  const mockStationService = {
    findAll: jest.fn().mockResolvedValue([sampleStation]),
    findOne: jest.fn().mockResolvedValue(sampleStation),
  } as unknown as StationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartureService,
        { provide: getRepositoryToken(Departure), useValue: mockRepo },
        { provide: StationService, useValue: mockStationService },
      ],
    }).compile();

    service = module.get<DepartureService>(DepartureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getNextDeparturesForAllStations returns station map with local time fields', async () => {
    const result = await service.getNextDeparturesForAllStations();
    expect(result).toBeDefined();
    expect(result['Test Station']).toBeDefined();
    expect(result['Test Station'].length).toBeGreaterThan(0);
    const dep = result['Test Station'][0];
    expect(dep.scheduledDepartureUtc).toBeDefined();
    expect(dep.scheduledDepartureLocal).toBeDefined();
    expect(typeof dep.scheduledDepartureLocal).toBe('string');
  });

  it('findByPtvStation returns departures with local fields', async () => {
    const res = await service.findByPtvStation(999);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].scheduledDepartureLocal).toBeDefined();
    expect(res[0].estimatedDepartureLocal).toBeDefined();
  });

  it('create() calls repository.save with station and dates', async () => {
    // prepare DTO
    const createDto: any = {
      stationId: 1,
      direction: '1',
      platform: '2',
      scheduledDepartureUtc: '2025-07-10T01:00:00.000Z',
      estimatedDepartureUtc: '2025-07-10T01:05:00.000Z',
    };

    // mock create & save behavior
    const saved = { ...createDto, id: 999 };
    (mockRepo as any).create = jest.fn().mockReturnValue(saved);
    (mockRepo as any).save = jest.fn().mockResolvedValue(saved);

    const res = await service.create(createDto);
    expect((mockRepo as any).create).toHaveBeenCalled();
    expect((mockRepo as any).save).toHaveBeenCalledWith(saved);
    expect(res.id).toBe(999);
  });
});
