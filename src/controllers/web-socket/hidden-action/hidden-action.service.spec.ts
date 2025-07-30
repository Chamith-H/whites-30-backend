import { Test, TestingModule } from '@nestjs/testing';
import { HiddenActionService } from './hidden-action.service';

describe('HiddenActionService', () => {
  let service: HiddenActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiddenActionService],
    }).compile();

    service = module.get<HiddenActionService>(HiddenActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
