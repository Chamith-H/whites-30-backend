import { Test, TestingModule } from '@nestjs/testing';
import { EditLogService } from './edit-log.service';

describe('EditLogService', () => {
  let service: EditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditLogService],
    }).compile();

    service = module.get<EditLogService>(EditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
