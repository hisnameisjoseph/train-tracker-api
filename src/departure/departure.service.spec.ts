import { Test, TestingModule } from '@nestjs/testing';
import { DepartureService } from './departure.service';

describe('DepartureService', () => {
  let service: DepartureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartureService],
    }).compile();

    service = module.get<DepartureService>(DepartureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
