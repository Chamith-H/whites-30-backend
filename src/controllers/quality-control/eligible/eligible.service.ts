import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { FilterItemDto } from 'src/controllers/master-data/item/dto/filter-item.dto';
import { SapB1RequestService } from 'src/controllers/sap-integration/sap-b1-request/sap-b1-request.service';
import {
  ItemTest,
  ItemTestDocument,
} from 'src/schemas/common/item-test.schema';
import {
  WarehouseTest,
  WarehouseTestDocument,
} from 'src/schemas/common/warehouse-test.schema';
import { EligibleItemDto } from './dto/eligible-item.dto';
import { EligibleWarehouseDto } from './dto/eligible-warehouse.dto';
import { FilterWarehouseDto } from './dto/filter-warehouse.dto';

@Injectable()
export class EligibleService {
  constructor(
    @InjectModel(ItemTest.name)
    private readonly itemTestModel: Model<ItemTestDocument>,

    @InjectModel(WarehouseTest.name)
    private readonly warehouseTestModel: Model<WarehouseTestDocument>,

    private readonly sapB1Service: SapB1RequestService,
    private readonly paginationService: PaginationService,
  ) {}

  async getItems(dto: EligibleItemDto, pagination: PaginationStructure) {
    if (dto.ItemCode) {
      const regex = new RegExp(dto.ItemCode, 'i');
      dto.ItemCode = regex;
    }

    if (dto.ItemName) {
      const regex = new RegExp(dto.ItemName, 'i');
      dto.ItemName = regex;
    }

    // DB data filtering query
    const list = await this.itemTestModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    //Pass to get pagination
    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.itemTestModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    //-->
    return await this.paginationService.render_toPAGE(currentPage);
  }

  async getWarehouses(
    dto: EligibleWarehouseDto,
    pagination: PaginationStructure,
  ) {
    if (dto.WarehouseCode) {
      const regex = new RegExp(dto.WarehouseCode, 'i');
      dto.WarehouseCode = regex;
    }

    if (dto.WarehouseName) {
      const regex = new RegExp(dto.WarehouseName, 'i');
      dto.WarehouseName = regex;
    }

    // DB data filtering query
    const list = await this.warehouseTestModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    //Pass to get pagination
    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.warehouseTestModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    //-->
    return await this.paginationService.render_toPAGE(currentPage);
  }

  async warehouseDrop(dto: FilterWarehouseDto) {
    const warehouses = await this.warehouseTestModel.find(dto);

    const warehouseMapper = warehouses.map((wh: WarehouseTest) => {
      const returner = {
        name: wh.WarehouseName,
        _id: wh.WarehouseCode,
      };

      return returner;
    });

    return warehouseMapper;
  }
}
