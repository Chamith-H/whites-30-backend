import { Injectable } from '@nestjs/common';
import { B1ApiService } from '../config/b1-api.service';
import { DropdownConverterService } from 'src/config/services/dropdown-converter/dropdown-converter.service';
import { GetRequestStructure } from '../config/interfaces/get-request.interface';
import { ItemListModel } from './models/item-list.model';
import { DropdownStructure } from 'src/config/interfaces/drop-down.structure';
import { PaginationRequestStructure } from '../config/interfaces/pagination-request.interface';
import { PostRequestStructure } from '../config/interfaces/post-request.interface';
import { PatchRequestStructure } from '../config/interfaces/patch-request.interface';

@Injectable()
export class SapB1RequestService {
  constructor(private readonly b1ApiService: B1ApiService) {}

  //!--> Get | Items | Pagination.......................................................................|
  async getItems(
    limit: number,
    skip: number,
    page: number,
    filter: string,
    counter: string,
  ) {
    const paginationEndpoint: PaginationRequestStructure = {
      path: 'Items',
      datalogic:
        ` & $select=ItemCode,ItemName,ItemType,InventoryItem,PurchaseItem,SalesItem,ItemsGroupCode,UoMGroupEntry,GLMethod,CostAccountingMethod,PlanningSystem,ProcurementMethod,IssueMethod & $orderby=CreateDate desc` +
        filter,
      counterlogic: counter,
      limit: limit,
      skip: skip,
      page: page,
    };

    return await this.b1ApiService.pagination_GET(paginationEndpoint);
  }

  //!--> Create Item
  async createItem(data: any) {
    const endpoint: PostRequestStructure = {
      path: 'Items',
      body: data,
    };

    return await this.b1ApiService.request_POST(endpoint);
  }

  //!--> Update Item
  async updateItem(id: string, data: any) {
    const endpoint: PatchRequestStructure = {
      id: id,
      path: 'Items',
      body: data,
    };

    return await this.b1ApiService.request_PATCH(endpoint);
  }

  //!--> Get | PO s | Pagination.......................................................................|
  async getPOs(
    limit: number,
    skip: number,
    page: number,
    filter: string,
    counter: string,
  ) {
    const paginationEndpoint: PaginationRequestStructure = {
      path: 'PurchaseOrders',
      datalogic:
        ` & $select=DocEntry,DocNum,CardCode,CardName,DocDate,DocumentLines & $orderby=DocDate desc` +
        filter,
      counterlogic: counter,
      limit: limit,
      skip: skip,
      page: page,
    };

    return await this.b1ApiService.pagination_GET(paginationEndpoint);
  }
}
