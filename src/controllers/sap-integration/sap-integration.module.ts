import { Module } from '@nestjs/common';
import { B1SessionService } from './config/b1-session.service';
import { B1ApiService } from './config/b1-api.service';
import { SapB1RequestController } from './sap-b1-request/sap-b1-request.controller';
import { SapB1RequestService } from './sap-b1-request/sap-b1-request.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SapSession,
  SapSessionSchema,
} from 'src/schemas/common/sap-session.schema';
import { DropdownConverterService } from 'src/config/services/dropdown-converter/dropdown-converter.service';
import {
  SapMaster,
  SapMasterSchema,
} from 'src/schemas/common/sap-master.schema';
import { SapMasterService } from './sap-master/sap-master.service';
import { SapMasterController } from './sap-master/sap-master.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SapSession.name, schema: SapSessionSchema },
      { name: SapMaster.name, schema: SapMasterSchema },
    ]),
  ],
  providers: [
    B1SessionService,
    B1ApiService,
    SapB1RequestService,
    DropdownConverterService,
    SapMasterService,
  ],
  controllers: [SapB1RequestController, SapMasterController],
  exports: [SapB1RequestService],
})
export class SapIntegrationModule {}
