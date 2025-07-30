import { Body, Controller, Get, Post } from '@nestjs/common';
import { SapMasterService } from './sap-master.service';
import { MasterItemsDto } from './dto/master-items.dto';

@Controller('sap-master')
export class SapMasterController {
  constructor(private readonly sapMsterService: SapMasterService) {}

  //!--> Get master data for Items
  @Get('item-msaters')
  async getMasterDataForItems() {
    return await this.sapMsterService.get_itemMsterData();
  }

  //!--> Get actual data
  @Post('item-actual')
  async getActualData(@Body() dto: MasterItemsDto) {
    return await this.sapMsterService.get_actualData(dto);
  }
}
