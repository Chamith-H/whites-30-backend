import { Controller, Get } from '@nestjs/common';
import { SapB1RequestService } from './sap-b1-request.service';

@Controller('sap-b1-request')
export class SapB1RequestController {
  constructor(private sapB1RequestService: SapB1RequestService) {}
}
