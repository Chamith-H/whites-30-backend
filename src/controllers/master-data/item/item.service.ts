import { Injectable } from '@nestjs/common';
import { SapB1RequestService } from 'src/controllers/sap-integration/sap-b1-request/sap-b1-request.service';
import { FilterItemDto } from './dto/filter-item.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { ItemDto } from './dto/item.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ItemTest,
  ItemTestDocument,
} from 'src/schemas/common/item-test.schema';
import { Model } from 'mongoose';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(ItemTest.name)
    private readonly itemTestModel: Model<ItemTestDocument>,

    private readonly sapB1Service: SapB1RequestService,
    private readonly paginationService: PaginationService,
  ) {}

  //!--> Get Items with pagination......................................................................|
  async getItems(dto: FilterItemDto, pagination: PaginationStructure) {
    // if (dto.ItemCode) {
    //   const regex = new RegExp(dto.ItemCode, 'i');
    //   dto.ItemCode = regex;
    // }

    // if (dto.ItemName) {
    //   const regex = new RegExp(dto.ItemName, 'i');
    //   dto.ItemName = regex;
    // }

    // // DB data filtering query
    // const list = await this.itemTestModel
    //   .find(dto)
    //   .skip(pagination.offset)
    //   .limit(pagination.limit)
    //   .sort({ number: -1 });

    // //Pass to get pagination
    // const currentPage: TablePaginationInterface = {
    //   data: list,
    //   model: this.itemTestModel,
    //   query: dto,
    //   currentPage: pagination.page,
    //   dataLimit: pagination.limit,
    // };

    // //-->
    // return await this.paginationService.render_toPAGE(currentPage);

    let filterString = '';
    let counterString = '';

    let queryArray: string[] = [];

    const isEmptyFilter = Object.keys(dto).length === 0;

    if (!isEmptyFilter) {
      if (dto.ItemCode) {
        queryArray.push(`substringof('${dto.ItemCode}',ItemCode)`);
      }

      if (dto.ItemName) {
        queryArray.push(`substringof('${dto.ItemName}',ItemName)`);
      }

      const queryCount: number = queryArray.length;

      const filterQuery = queryArray.map((eachFilter, index) => {
        if (queryCount === 1 || index === queryCount - 1) {
          return eachFilter;
        } else {
          return `${eachFilter} and`;
        }
      });

      const finalQuery: string = filterQuery.join(' ');

      filterString = '&$filter=' + finalQuery;
      counterString = '?$filter=' + finalQuery;
    }

    const pagingData = await this.sapB1Service.getItems(
      pagination.limit,
      pagination.offset,
      pagination.page,
      filterString,
      counterString,
    );

    return pagingData;
  }

  //!--> Create new item................................................................................|
  async createNewItem(dto: ItemDto) {
    let isInventoryItem = 'N';
    let isPurchaseItem = 'N';
    let isSalesItem = 'N';

    if (dto.category.some((cat: string) => cat === 'inventory')) {
      isInventoryItem = 'Y';
    }

    if (dto.category.some((cat: string) => cat === 'purchasing')) {
      isPurchaseItem = 'Y';
    }

    if (dto.category.some((cat: string) => cat === 'sales')) {
      isSalesItem = 'Y';
    }

    const sapItem = {
      ItemCode: dto.code,
      ItemName: dto.name,
      ItemType: dto.type,
      InventoryItem: isInventoryItem,
      PurchaseItem: isPurchaseItem,
      SalesItem: isSalesItem,
      ItemsGroupCode: dto.group,
      UoMGroupEntry: dto.uomGroup,
      GLMethod: dto.invMethod,
      CostAccountingMethod: dto.valMethod,
      PlanningSystem: dto.planMethod,
      ProcurementMethod: dto.procumentMethod,
      IssueMethod: dto.issueMethod,
    };

    const respose = await this.sapB1Service.createItem(sapItem);

    if (respose) {
      return { message: 'Item Created Successfully!' };
    }
  }

  //!--> Update selected item..........................................................................|
  async updateItem(dto: ItemDto) {
    console.log('ReadyS');
    let isInventoryItem = 'N';
    let isPurchaseItem = 'N';
    let isSalesItem = 'N';

    if (dto.category.some((cat: string) => cat === 'inventory')) {
      isInventoryItem = 'Y';
    }

    if (dto.category.some((cat: string) => cat === 'purchasing')) {
      isPurchaseItem = 'Y';
    }

    if (dto.category.some((cat: string) => cat === 'sales')) {
      isSalesItem = 'Y';
    }

    const sapItem = {
      ItemName: dto.name,
      ItemType: dto.type,
      InventoryItem: isInventoryItem,
      PurchaseItem: isPurchaseItem,
      SalesItem: isSalesItem,
      ItemsGroupCode: dto.group,
      UoMGroupEntry: dto.uomGroup,
      GLMethod: dto.invMethod,
      CostAccountingMethod: dto.valMethod,
      PlanningSystem: dto.planMethod,
      ProcurementMethod: dto.procumentMethod,
      IssueMethod: dto.issueMethod,
    };

    const respose = await this.sapB1Service.updateItem(dto.code, sapItem);

    if (respose) {
      return { message: 'Item Updated Successfully!' };
    }
  }
}
