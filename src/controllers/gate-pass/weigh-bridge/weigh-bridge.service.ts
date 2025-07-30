import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { UtcDateGenerator } from 'src/config/services/utc-date-generator/utc-date.generator';
import { SapB1RequestService } from 'src/controllers/sap-integration/sap-b1-request/sap-b1-request.service';
import {
  GatePassLine,
  GatePassLineDocument,
} from 'src/schemas/gate-pass/gate-pass-line.schema';
import {
  GatePass,
  GatePassDocument,
} from 'src/schemas/gate-pass/gate-pass.schema';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { FilterGatePassDto } from './dto/filter-gate-pass.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { WeightRecordDto } from './dto/weight-record.dto';

@Injectable()
export class WeighBridgeService {
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

  //!--> Get all weighbridges
  async getWeighbridges(
    dto: FilterGatePassDto,
    pagination: PaginationStructure,
  ) {
    // Name searching matched given string
    if (dto.gatePassId) {
      const regex = new RegExp(dto.gatePassId, 'i');
      dto.gatePassId = regex;
    }

    if (dto.itemCode) {
      const regex = new RegExp(dto.itemCode, 'i');
      dto.itemCode = regex;
    }

    if (dto.po) {
      const regex = new RegExp(dto.po, 'i');
      dto.po = regex;
    }

    // DB data filtering query
    const list = await this.gatePassLineModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    //Pass to get pagination
    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.gatePassLineModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    //-->
    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Weight record
  async recordWeight(dto: WeightRecordDto) {
    const weightUpdater = await this.gatePassLineModel.updateOne(
      {
        _id: dto.id,
      },
      {
        $set: {
          firstWeight: dto.firstWeight,
          secondWeight: dto.secondWeight,
        },
      },
    );

    if (weightUpdater) {
      return {
        message: 'Weights updated successfully!',
      };
    }
  }

  //!--> Complete transaction
  async completeTransaction(id: string, userId: string) {
    const currentDate = await this.dateCreaterService.getTodayDate();

    const response = await this.gatePassLineModel.updateOne(
      { _id: id },
      {
        $set: {
          status: 'Completed',
          recordedBy: userId,
          recordedDate: currentDate,
        },
      },
    );

    if (response) {
      return { message: 'Weight record completed successfully!' };
    }
  }
}
