import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { FilterItemDto } from './dto/filter-item.dto';
import { ItemDto } from './dto/item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  //!--> Get Items | With pagination............................................................|
  @HttpCode(200)
  @Post('all')
  async getItemData(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterItemDto,
  ) {
    return await this.itemService.getItems(dto, pagination);
  }

  //!--> Create Item...........................................................................|
  @Post('create')
  async createItem(@Body() dto: ItemDto) {
    return await this.itemService.createNewItem(dto);
  }

  //!--> Update Item...........................................................................|
  @Post('update')
  async updateItem(@Body() dto: ItemDto) {
    return await this.itemService.updateItem(dto);
  }
}
