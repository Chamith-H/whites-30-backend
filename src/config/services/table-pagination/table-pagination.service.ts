import { TablePaginationInterface } from './table-pagination.interface';

export class PaginationService {
  async render_toPAGE(pagingModel: TablePaginationInterface) {
    const total = await pagingModel.model.countDocuments(pagingModel.query);

    return {
      data: pagingModel.data,
      dataCount: total,
      pageCount: Math.ceil(total / pagingModel.dataLimit),
      currentPage: pagingModel.currentPage,
    };
  }
}
