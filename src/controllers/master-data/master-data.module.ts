import { Module } from '@nestjs/common';
import { ItemService } from './item/item.service';
import { ItemController } from './item/item.controller';
import { SapIntegrationModule } from '../sap-integration/sap-integration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemTest, ItemTestSchema } from 'src/schemas/common/item-test.schema';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemTest.name, schema: ItemTestSchema },
    ]),
    SapIntegrationModule,
  ],
  providers: [ItemService, PaginationService],
  controllers: [ItemController],
})
export class MasterDataModule {}
