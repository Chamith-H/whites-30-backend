import { BadRequestException, Injectable } from '@nestjs/common';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Stage,
  StageDocument,
} from 'src/schemas/quality-control/stage/stage.schema';
import { Model } from 'mongoose';
import {
  QualityChecking,
  QualityCheckingDocument,
} from 'src/schemas/quality-control/inspection/quality-checking.schema';
import { ObservedValuesDto } from './dto/update-obsereds.dto';
import { UtcDateGenerator } from 'src/config/services/utc-date-generator/utc-date.generator';
import { SapTest, SapTestDocument } from 'src/schemas/common/sap-test.schema';
import {
  StageHead,
  StageHeadDocument,
} from 'src/schemas/quality-control/stage/stage-head.schema';
import { InspectionDto } from './dto/inspection.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { StartingConfDto } from './dto/starting-conf.dto';
import { SampleDto } from './dto/sample.dto';
import { StartingObserverDto } from './dto/starting-observer.dto';
import { SetActionDto } from './dto/set-action.dto';
import { SaveDataDto } from './dto/save-data.dto';
import {
  InspectDoc,
  InspectDocDocument,
} from 'src/schemas/quality-control/inspection/inspect-doc.schema';

@Injectable()
export class InspectionService {
  constructor(
    @InjectModel(StageHead.name)
    private readonly stageHeadModel: Model<StageHeadDocument>,

    @InjectModel(Stage.name)
    private readonly stageModel: Model<StageDocument>,

    @InjectModel(SapTest.name)
    private readonly sapTestModel: Model<SapTestDocument>,

    @InjectModel(QualityChecking.name)
    private readonly qualityCheckingModel: Model<QualityCheckingDocument>,

    @InjectModel(InspectDoc.name)
    private readonly inspectDocModel: Model<InspectDocDocument>,

    private readonly dateCreaterService: UtcDateGenerator,
    private readonly paginationService: PaginationService,
  ) {}

  //!--> Get pending inspections
  async gerPendingInspections(
    dto: InspectionDto,
    pagination: PaginationStructure,
  ) {
    if (dto.ItemCode) {
      const regex = new RegExp(dto.ItemCode, 'i');
      dto.ItemCode = regex;
    }

    if (dto.stage === '') {
      delete dto.stage;
    }

    const list = await this.sapTestModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit);

    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.sapTestModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Checking starting conf
  async checkingStartingConf(dto: StartingConfDto) {
    const startingConf = await this.stageHeadModel.findOne(dto);
    return startingConf;
  }

  //!--> Start inspection
  async startQcInspection(dto: StartInspectionDto) {
    const itemParameters = await this.stageModel
      .find({
        stageName: dto.stageName,
        itemCode: dto.itemCode,
        status: true,
      })
      .populate({ path: 'parameter', populate: { path: 'uom' } });

    if (itemParameters.length === 0) {
      throw new BadRequestException('No QC-parameters to quality checking!');
    }

    let samples = [];
    let sampleValues = [];

    for (let i = 1; i <= Number(dto.sampleCount); i++) {
      samples.push({ name: `sample ${i}`, colValue: `sample_${i}` });
      sampleValues.push({ [`sample_${i}`]: '' });
    }

    return {
      samples: samples,
      values: itemParameters,
      sampleValues: sampleValues,
    };
  }

  //!--> Get checking values
  async getCheckingValues(dto: StartingObserverDto) {
    const parameterObservds = await this.qualityCheckingModel
      .find(dto)
      .populate({ path: 'parameter', populate: { path: 'uom' } })
      .populate({ path: 'stage' })
      .sort('sampleNumber');

    const transformed = [];

    for (const obs of parameterObservds as any[]) {
      const paramId = obs.parameter._id.toString();

      let existingParam = transformed.find((p) => p.parameterId === paramId);

      const sample = {
        sampleId: obs._id.toString(),
        sampleName: obs.name,
        sampleIndex: obs.sampleNumber,
        observedValue: obs.observedValue,
      };

      if (!existingParam) {
        existingParam = {
          parameterId: paramId,
          parameterIdenity: `${obs.parameter.name} (${obs.parameter.code})`,
          parameterCategory: obs.parameter.category,
          parameterType: obs.parameter.type,
          parameterUom: `${obs.parameter.uom.name} (${obs.parameter.uom.code})`,
          mandatory: obs.stage.mandatory,
          minValue: obs.stage.minValue,
          maxValue: obs.stage.maxValue,
          stdValue: obs.stage.stdValue,
          samplingData: [sample],
        };
        transformed.push(existingParam);
      } else {
        existingParam.samplingData.push(sample);
      }
    }

    return transformed;
  }

  //!--> Update observeds
  async updateObserveds(dto: ObservedValuesDto, userId: string) {
    const valueMapper = await Promise.all(
      dto.obsData.map(async (o_data: any) => {
        const valueUpdater = await this.qualityCheckingModel.updateOne(
          {
            _id: o_data.checkingId,
          },
          { $set: { observedValue: o_data.observedValue } },
        );

        if (valueUpdater.modifiedCount === 1) {
          const todayDate = await this.dateCreaterService.getTodayDate();

          const checkerUpdater = await this.qualityCheckingModel.updateOne(
            {
              _id: o_data.checkingId,
            },
            { $set: { inspectedBy: userId, inspectedDate: todayDate } },
          );

          if (checkerUpdater.acknowledged) {
            return valueUpdater;
          }
        } else {
          return valueUpdater;
        }
      }),
    );

    if (valueMapper) {
      delete dto.obsData;

      const checkingItems = await this.qualityCheckingModel
        .find(dto)
        .populate({ path: 'parameter', populate: { path: 'uom' } });

      return checkingItems;
    }
  }

  //!--> Create Samples
  async createSamples(dto: SampleDto, userId: string) {
    const currentDate = await this.dateCreaterService.getTodayDate();

    const paramValueMapper = await Promise.all(
      dto.parameterValues.rows.map(async (p_value: any) => {
        const stage = await this.stageModel.findOne({
          parameter: p_value.parameter,
          stageName: dto.stage,
          itemCode: dto.itemCode,
        });

        const mappedSampler = Object.entries(p_value.sampleData[0]).map(
          ([key, value], index) => ({
            key,
            value,
            index,
          }),
        );

        const sampleMapper = await Promise.all(
          mappedSampler.map(async (s_data: any) => {
            const newSample: QualityChecking = {
              name: s_data.key,
              sampleNumber: parseInt(s_data.key.replace('sample_', '')),
              stageName: dto.stage,
              docNum: dto.docNum,
              itemCode: dto.itemCode,
              round: dto.round,
              parameter: p_value.parameter,
              stage: stage._id.toString(),
              observedValue: s_data.value,
              inspectedDate: currentDate,
              inspectedBy: userId,
            };

            const sampleDoc = new this.qualityCheckingModel(newSample);
            return await sampleDoc.save();
          }),
        );

        return sampleMapper;
      }),
    );

    if (paramValueMapper) {
      const sapUpdater = await this.sapTestModel.updateOne(
        {
          DocNum: dto.docNum,
          ItemCode: dto.itemCode,
          U_Round: dto.round,
        },
        { $set: { U_Approval: 'Pending' } },
      );

      if (sapUpdater) {
        return { message: 'QC inspection started successfully!' };
      }
    }
  }

  //!--> Save data
  async saveData(dto: SaveDataDto) {
    const dataMapper = await Promise.all(
      dto.data.map(async (sample: any) => {
        const updater = await this.qualityCheckingModel.updateOne(
          { _id: sample.sampleId },
          { $set: { observedValue: sample.observedValue } },
        );

        return updater;
      }),
    );

    return dataMapper;
  }

  //!--> Set action
  async setAction(id: string, dto: SetActionDto, userId: string) {
    const currentDate = await this.dateCreaterService.getTodayDate();

    const updateBody = {
      U_ActionedDate: currentDate,
      U_ActionedBy: userId,
      ...dto,
    };

    const updater = await this.sapTestModel.updateOne(
      { _id: id },
      { $set: updateBody },
    );

    if (!updater.acknowledged) {
      throw new BadRequestException('Internal server error!');
    }

    return {
      message: `Inspection ${dto.U_Approval} Successfully!`,
    };
  }

  //!--> Save image
  async saveInspectImg(dto: any) {
    const newDoc = new this.inspectDocModel(dto);
    const response = await newDoc.save();

    if (response) {
      return {
        message: 'Document uploaded successfully!',
      };
    }
  }

  //!--> Get documents
  async getDocuments(id: string) {
    return await this.inspectDocModel.find({ refId: id });
  }

  async deleteDocument(id: string) {
    return await this.inspectDocModel.deleteOne({ _id: id });
  }
}
