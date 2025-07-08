import { Test, TestingModule } from '@nestjs/testing';
import { PtvService } from './ptv.service';

describe('PtvService', () => {
  let service: PtvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PtvService],
    }).compile();

    service = module.get<PtvService>(PtvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
