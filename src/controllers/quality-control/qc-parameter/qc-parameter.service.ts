import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { UtcDateGenerator } from 'src/config/services/utc-date-generator/utc-date.generator';
import {
  Equipment,
  EquipmentDocument,
} from 'src/schemas/quality-control/qc-parameter/equipment.schema';
import {
  QcParameter,
  QcParameterDocument,
} from 'src/schemas/quality-control/qc-parameter/qc-parameter.schema';
import {
  Uom,
  UomDocument,
} from 'src/schemas/quality-control/qc-parameter/uom.schema';
import { UomDto } from './dto/uom.dto';
import {
  CreateCheckUniqueStructure,
  UpdateCheckUniqueStructure,
} from 'src/config/services/uniqueness-checker/uniqueness-checker.interface';
import { CheckUniquenessService } from 'src/config/services/uniqueness-checker/uniqueness-checker.service';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterUomDto } from './dto/uom-filter.dto';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { EquipmentDto } from './dto/equipment.dto';
import { FilterEquipmentDto } from './dto/equipment-filter.dto';
import { QcParameterDto } from './dto/qc-parameter.dto';
import { FilterQcParameterDto } from './dto/qc-parameter-filter.dto';
import {
  Stage,
  StageDocument,
} from 'src/schemas/quality-control/stage/stage.schema';

@Injectable()
export class QcParameterService {
  constructor(
    @InjectModel(Uom.name)
    private readonly uomModel: Model<UomDocument>,

    @InjectModel(Equipment.name)
    private readonly equipmentModel: Model<EquipmentDocument>,

    @InjectModel(QcParameter.name)
    private readonly qcParameterModel: Model<QcParameterDocument>,

    @InjectModel(Stage.name)
    private readonly stageModel: Model<StageDocument>,

    private readonly uniqueCodeGenetatorService: UniqueCodeGeneratorService,
    private readonly dateCreaterService: UtcDateGenerator,
    private readonly paginationService: PaginationService,
    private readonly checkUniquenessService: CheckUniquenessService,
  ) {}

  //!--> Create UOM
  async createUOM(dto: UomDto) {
    const checkingObjectCode: CreateCheckUniqueStructure = {
      dataModel: this.uomModel,
      key: 'code',
      value: dto.code,
      error: 'This UOM code has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectCode);

    const checkingObjectName: CreateCheckUniqueStructure = {
      dataModel: this.uomModel,
      key: 'name',
      value: dto.name,
      error: 'This UOM name has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectName);

    const newUom = new this.uomModel(dto);
    const response = await newUom.save();

    if (response) {
      return { message: 'UOM created successfuly!' };
    }
  }

  //!--> Edit UOM
  async editUOM(id: string, dto: UomDto) {
    const checkingObjectCode: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.uomModel,
      key: 'code',
      value: dto.code,
      error: 'This UOM code has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectCode);

    const checkingObjectName: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.uomModel,
      key: 'name',
      value: dto.name,
      error: 'This UOM name has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectName);

    const updater = await this.uomModel.updateOne({ _id: id }, { $set: dto });

    if (!updater.acknowledged) {
      throw new BadRequestException('UOM update failed!');
    }

    return { message: 'UOM updated successfuly!' };
  }

  //!--> Get UOMs
  async getUoms(dto: FilterUomDto, pagination: PaginationStructure) {
    if (dto.code) {
      const regex = new RegExp(dto.code, 'i');
      dto.code = regex;
    }

    if (dto.name) {
      const regex = new RegExp(dto.name, 'i');
      dto.name = regex;
    }

    const list = await this.uomModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit);

    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.uomModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Delete UOM
  async deleteUom(id: string) {
    const uom = await this.uomModel.findById(id);
    if (!uom) {
      throw new BadRequestException('UOM not found!');
    }
    // Check if the UOM is used in any QC parameter
    const parameterExists = await this.qcParameterModel.exists({ uom: id });
    if (parameterExists) {
      throw new BadRequestException(
        'This UOM is used in a QC parameter and cannot be deleted!',
      );
    }
    // Proceed to delete the UOM
    const deletionResult = await this.uomModel.deleteOne({ _id: id });
    if (deletionResult.deletedCount === 0) {
      throw new BadRequestException('UOM deletion failed!');
    }
    return { message: 'UOM deleted successfully!' };
  }

  //!--> Create Equipment
  async createEquipment(dto: EquipmentDto) {
    const checkingObjectCode: CreateCheckUniqueStructure = {
      dataModel: this.equipmentModel,
      key: 'code',
      value: dto.code,
      error: 'This UOM code has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectCode);

    const checkingObjectName: CreateCheckUniqueStructure = {
      dataModel: this.equipmentModel,
      key: 'name',
      value: dto.name,
      error: 'This UOM name has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectName);

    const newUom = new this.equipmentModel(dto);
    const response = await newUom.save();

    if (response) {
      return { message: 'Equipment created successfuly!' };
    }
  }

  //!--> Edit equipment
  async editEquipment(id: string, dto: EquipmentDto) {
    const checkingObjectCode: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.equipmentModel,
      key: 'code',
      value: dto.code,
      error: 'This equipment code has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectCode);

    const checkingObjectName: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.equipmentModel,
      key: 'name',
      value: dto.name,
      error: 'This equipment name has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectName);

    const updater = await this.equipmentModel.updateOne(
      { _id: id },
      { $set: dto },
    );
    if (!updater.acknowledged) {
      throw new BadRequestException('Equipment update failed!');
    }
    return { message: 'Equipment updated successfuly!' };
  }

  //!--> Delete Equipment
  async deleteEquipment(id: string) {
    const equipment = await this.equipmentModel.findById(id);
    if (!equipment) {
      throw new BadRequestException('Equipment not found!');
    }
    // Check if the equipment is used in any QC parameter
    const parameterExists = await this.qcParameterModel.exists({
      equipment: id,
    });
    if (parameterExists) {
      throw new BadRequestException(
        'This equipment is used in a QC parameter and cannot be deleted!',
      );
    }
    // Proceed to delete the equipment
    const deletionResult = await this.equipmentModel.deleteOne({ _id: id });
    if (deletionResult.deletedCount === 0) {
      throw new BadRequestException('Equipment deletion failed!');
    }
    return { message: 'Equipment deleted successfully!' };
  }

  //!--> Get Equipments
  async getEquipments(
    dto: FilterEquipmentDto,
    pagination: PaginationStructure,
  ) {
    if (dto.code) {
      const regex = new RegExp(dto.code, 'i');
      dto.code = regex;
    }

    if (dto.name) {
      const regex = new RegExp(dto.name, 'i');
      dto.name = regex;
    }

    const list = await this.equipmentModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit);

    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.equipmentModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Get uom dropdown
  async uomDropdown() {
    return await this.uomModel.find({});
  }

  //!--> Get equipment dropdown
  async equipmentDropdown() {
    return await this.equipmentModel.find({});
  }

  //!--> Create QC parameter
  async createQcParameter(dto: QcParameterDto) {
    const checkingObjectCode: CreateCheckUniqueStructure = {
      dataModel: this.qcParameterModel,
      key: 'code',
      value: dto.code,
      error: 'This parameter code has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectCode);

    const checkingObjectName: CreateCheckUniqueStructure = {
      dataModel: this.qcParameterModel,
      key: 'name',
      value: dto.name,
      error: 'This parameter name has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObjectName);

    const newParameter = new this.qcParameterModel(dto);
    const response = await newParameter.save();

    if (response) {
      return { message: 'QC parameter created successfuly!' };
    }
  }

  //!--> Edit QC parameter
  async editQcParameter(id: string, dto: QcParameterDto) {
    const checkingObjectCode: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.qcParameterModel,
      key: 'code',
      value: dto.code,
      error: 'This parameter code has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectCode);

    const checkingObjectName: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.qcParameterModel,
      key: 'name',
      value: dto.name,
      error: 'This parameter name has been already created!',
    };

    // Check for updating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObjectName);

    const updater = await this.qcParameterModel.updateOne(
      { _id: id },
      { $set: dto },
    );

    if (!updater.acknowledged) {
      throw new BadRequestException('QC parameter update failed!');
    }

    return { message: 'QC parameter updated successfuly!' };
  }

  //!--> Get QC parameters
  async getQcParameters(
    dto: FilterQcParameterDto,
    pagination: PaginationStructure,
  ) {
    if (dto.code) {
      const regex = new RegExp(dto.code, 'i');
      dto.code = regex;
    }

    if (dto.name) {
      const regex = new RegExp(dto.name, 'i');
      dto.name = regex;
    }

    const list = await this.qcParameterModel
      .find(dto)
      .populate('uom equipment')
      .skip(pagination.offset)
      .limit(pagination.limit);

    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.qcParameterModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Delete QC parameter
  async deleteQcParameter(id: string) {
    const parameter = await this.qcParameterModel.findById(id);
    if (!parameter) {
      throw new BadRequestException('QC parameter not found!');
    }
    // Check if the parameter is used in any stage
    const stageExists = await this.stageModel.exists({ parameter: id });
    if (stageExists) {
      throw new BadRequestException(
        'This QC parameter is used in a stage and cannot be deleted!',
      );
    }
    // Proceed to delete the parameter
    const deletionResult = await this.qcParameterModel.deleteOne({ _id: id });
    if (deletionResult.deletedCount === 0) {
      throw new BadRequestException('QC parameter deletion failed!');
    }
    return { message: 'QC parameter deleted successfully!' };
  }

  //!--> Get parameter dropdown
  async getParameterDropdown() {
    return await this.qcParameterModel.find({});
  }
}
