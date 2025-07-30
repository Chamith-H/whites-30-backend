import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EligibleService } from './eligible.service';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { EligibleItemDto } from './dto/eligible-item.dto';
import { EligibleWarehouseDto } from './dto/eligible-warehouse.dto';
import { FilterWarehouseDto } from './dto/filter-warehouse.dto';

@Controller('eligible')
export class EligibleController {
  constructor(private readonly eligibleService: EligibleService) {}

  @HttpCode(200)
  @Post('qc-items')
  async getItemData(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: EligibleItemDto,
  ) {
    return await this.eligibleService.getItems(dto, pagination);
  }

  @HttpCode(200)
  @Post('qc-warehouses')
  async getWarehouseData(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: EligibleWarehouseDto,
  ) {
    return await this.eligibleService.getWarehouses(dto, pagination);
  }

  @Post('warehouse-drop')
  async dropWarehouses(@Body() dto: FilterWarehouseDto) {
    return await this.eligibleService.warehouseDrop(dto);
  }
}
