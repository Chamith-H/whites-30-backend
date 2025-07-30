import { Injectable } from '@nestjs/common';
import { SapB1RequestService } from '../sap-integration/sap-b1-request/sap-b1-request.service';
import { FilterPoDto } from './dto/filter-po.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { GatePassDto } from './dto/gate-pass.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  GatePass,
  GatePassDocument,
} from 'src/schemas/gate-pass/gate-pass.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { UniqueCodeGeneratorInterface } from 'src/config/services/unique-code-generator/unique-code-generator.interface';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { UtcDateGenerator } from 'src/config/services/utc-date-generator/utc-date.generator';
import { GatePassFullDto } from './dto/gate-pass-full.dto';
import { FilterGAtePassDto } from './dto/filter-gatepass.dto';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import {
  GatePassLine,
  GatePassLineDocument,
} from 'src/schemas/gate-pass/gate-pass-line.schema';

@Injectable()
export class GatePassService {
  constructor(
    @InjectModel(GatePass.name)
    private readonly gatePassModel: Model<GatePassDocument>,
    @InjectModel(GatePassLine.name)
    private readonly gatePassLineModel: Model<GatePassLineDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly sapB1Service: SapB1RequestService,
    private readonly uniqueCodeGenetatorService: UniqueCodeGeneratorService,
    private readonly dateCreaterService: UtcDateGenerator,
    private readonly paginationService: PaginationService,
  ) {}

  //!--> Get PO s with pagination......................................................................|
  async getPOs(dto: FilterPoDto, pagination: PaginationStructure) {
    let filterString = '';
    let counterString = '';

    let queryArray: string[] = [];

    const isEmptyFilter = Object.keys(dto).length === 0;

    if (!isEmptyFilter) {
      if (dto.docNum) {
        queryArray.push(`substringof('${dto.docNum}',DocNum)`);
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

    const pagingData = await this.sapB1Service.getPOs(
      pagination.limit,
      pagination.offset,
      pagination.page,
      filterString,
      counterString,
    );

    return pagingData;
  }

  //!-->
  async gateCheckIn(dto: GatePassDto, userId: string) {
    const uniqueCodeObject: UniqueCodeGeneratorInterface = {
      dataModel: this.gatePassModel,
      prefix: 'GP-',
    };

    const uniqueCode =
      await this.uniqueCodeGenetatorService.create_newUniqueCode(
        uniqueCodeObject,
      );

    const todayDate = await this.dateCreaterService.getTodayDate();

    const newGatePass: GatePass = {
      number: uniqueCode.requestNumber,
      gatePassId: uniqueCode.requestId,
      ...dto,
      po: null,
      lineItems: [],
      state: 'Draft',
      createdBy: userId,
      createdDate: todayDate,
    };

    const newGatePassDocument = new this.gatePassModel(newGatePass);
    const response = await newGatePassDocument.save();

    if (response) {
      const originData = await this.gatePassModel
        .findOne({
          gatePassId: uniqueCode.requestId,
        })
        .populate({ path: 'createdBy' });

      return {
        data: originData,
        message: 'Check-in completed!',
      };
    }
  }

  //!-->
  async checkPo(poNumber: number) {
    return {
      message: 'Done',
    };
  }

  //!-->
  async updateGatePass(id: string, dto: GatePassFullDto) {
    const gatePass = await this.gatePassModel.findOne({ _id: id });

    const updater = await this.gatePassModel.updateOne(
      { _id: id },
      { $set: { ...dto, state: 'Completed' } },
    );

    if (updater) {
      const lineItemMapper = await Promise.all(
        dto.lineItems.map(async (l_item: any) => {
          const newGatePassLine: GatePassLine = {
            gatePass: id,
            gatePassId: gatePass.gatePassId,
            po: dto.po,
            itemCode: l_item.itemCode,
            uom: l_item.uom,
            checkedQty: l_item.checkedQuantity,
            firstWeight: '',
            secondWeight: '',
            status: 'Open',
            recordedBy: null,
            recordedDate: null,
          };

          const gatePassDoc = new this.gatePassLineModel(newGatePassLine);
          return await gatePassDoc.save();
        }),
      );

      if (lineItemMapper) {
        return { message: 'Saved successfully!' };
      }
    }
  }

  //!-->
  async getGatePassWithPagination(
    dto: FilterGAtePassDto,
    pagination: PaginationStructure,
  ) {
    if (dto.driverName) {
      const regex = new RegExp(dto.driverName, 'i');
      dto.driverName = regex;
    }

    if (dto.driverNic) {
      const regex = new RegExp(dto.driverNic, 'i');
      dto.driverNic = regex;
    }

    if (dto.vehicleNumber) {
      const regex = new RegExp(dto.vehicleNumber, 'i');
      dto.vehicleNumber = regex;
    }

    const list = await this.gatePassModel
      .find(dto)
      .populate({ path: 'createdBy' })
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.gatePassModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!-->
  async getSelectedGatePass(id: string) {
    const gatePass = await this.gatePassModel
      .findOne({ _id: id })
      .populate({ path: 'createdBy' });

    return gatePass;
  }

  //!-->
  async deleteGatePass(id: string) {
    const deleter = await this.gatePassModel.deleteOne({ _id: id });
    if (deleter) {
      return {
        message: 'Gate Pass deleted successfully!',
      };
    }
  }

  //!-->
  async viewGatePass(id: string) {
    const gatePass = await this.gatePassModel
      .findOne({ _id: id })
      .populate({ path: 'createdBy' });

    return gatePass;
  }
}
