import { Test, TestingModule } from '@nestjs/testing';
import { DepartureController } from './departure.controller';
import { DepartureService } from './departure.service';

describe('DepartureController', () => {
  let controller: DepartureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartureController],
      providers: [DepartureService],
    }).compile();

    controller = module.get<DepartureController>(DepartureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
