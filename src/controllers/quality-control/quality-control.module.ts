import { Module } from '@nestjs/common';
import { QcParameterService } from './qc-parameter/qc-parameter.service';
import { QcParameterController } from './qc-parameter/qc-parameter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Uom,
  UomSchema,
} from 'src/schemas/quality-control/qc-parameter/uom.schema';
import {
  Equipment,
  EquipmentSchema,
} from 'src/schemas/quality-control/qc-parameter/equipment.schema';
import {
  QcParameter,
  QcParameterSchema,
} from 'src/schemas/quality-control/qc-parameter/qc-parameter.schema';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { UtcDateGenerator } from 'src/config/services/utc-date-generator/utc-date.generator';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { CheckUniquenessService } from 'src/config/services/uniqueness-checker/uniqueness-checker.service';
import { StageService } from './stage/stage.service';
import { StageController } from './stage/stage.controller';
import {
  Stage,
  StageSchema,
} from 'src/schemas/quality-control/stage/stage.schema';
import { InspectionService } from './inspection/inspection.service';
import { InspectionController } from './inspection/inspection.controller';
import {
  QualityChecking,
  QualityCheckingSchema,
} from 'src/schemas/quality-control/inspection/quality-checking.schema';
import {
  StageHead,
  StageHeadSchema,
} from 'src/schemas/quality-control/stage/stage-head.schema';
import { SapTest, SapTestSchema } from 'src/schemas/common/sap-test.schema';
import { EligibleService } from './eligible/eligible.service';
import { EligibleController } from './eligible/eligible.controller';
import { ItemTest, ItemTestSchema } from 'src/schemas/common/item-test.schema';
import { SapIntegrationModule } from '../sap-integration/sap-integration.module';
import {
  WarehouseTest,
  WarehouseTestSchema,
} from 'src/schemas/common/warehouse-test.schema';
import {
  InspectDoc,
  InspectDocSchema,
} from 'src/schemas/quality-control/inspection/inspect-doc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Uom.name, schema: UomSchema },
      { name: Equipment.name, schema: EquipmentSchema },
      { name: QcParameter.name, schema: QcParameterSchema },
      { name: Stage.name, schema: StageSchema },
      { name: StageHead.name, schema: StageHeadSchema },
      { name: QualityChecking.name, schema: QualityCheckingSchema },
      { name: SapTest.name, schema: SapTestSchema },
      { name: ItemTest.name, schema: ItemTestSchema },
      { name: WarehouseTest.name, schema: WarehouseTestSchema },
      { name: InspectDoc.name, schema: InspectDocSchema },
    ]),
    SapIntegrationModule,
  ],
  providers: [
    QcParameterService,
    UniqueCodeGeneratorService,
    UtcDateGenerator,
    PaginationService,
    CheckUniquenessService,
    StageService,
    InspectionService,
    EligibleService,
  ],
  controllers: [
    QcParameterController,
    StageController,
    InspectionController,
    EligibleController,
  ],
})
export class QualityControlModule {}
