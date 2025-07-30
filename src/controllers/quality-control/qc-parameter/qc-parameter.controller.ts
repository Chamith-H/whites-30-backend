import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { QcParameterService } from './qc-parameter.service';
import { UomDto } from './dto/uom.dto';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterUomDto } from './dto/uom-filter.dto';
import { QcParameterDto } from './dto/qc-parameter.dto';
import { FilterQcParameterDto } from './dto/qc-parameter-filter.dto';

@Controller('qc-parameter')
export class QcParameterController {
  constructor(private readonly qcParameterService: QcParameterService) {}

  //!--> Create UOM
  @Post('create-uom')
  async createUom(@Body() dto: UomDto) {
    return await this.qcParameterService.createUOM(dto);
  }

  @Put('update-uom/:id')
  async updateUom(@Body() dto: UomDto, @Param('id') id: string) {
    return await this.qcParameterService.editUOM(id, dto);
  }

  @Delete('delete-uom/:id')
  async deleteUom(@Param('id') id: string) {
    return await this.qcParameterService.deleteUom(id);
  }

  //!--> Paginate Uom
  @HttpCode(200)
  @Post('all-uom')
  async getUomss(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterUomDto,
  ) {
    return await this.qcParameterService.getUoms(dto, pagination);
  }

  //!--> Create Equipment
  @Post('create-equipment')
  async createEquipment(@Body() dto: UomDto) {
    return await this.qcParameterService.createEquipment(dto);
  }

  //!--> Update Equipment
  @Put('update-equipment/:id')
  async updateEquipment(@Body() dto: UomDto, @Param('id') id: string) {
    return await this.qcParameterService.editEquipment(id, dto);
  }

  //!--> Delete Equipment
  @Delete('delete-equipment/:id')
  async deleteEquipment(@Param('id') id: string) {
    return await this.qcParameterService.deleteEquipment(id);
  }

  //!--> Paginate Equipment
  @HttpCode(200)
  @Post('all-equipment')
  async getEquipments(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterUomDto,
  ) {
    return await this.qcParameterService.getEquipments(dto, pagination);
  }

  //!--> Uom Dropdown
  @Get('uom-dropdown')
  async getUomDropdown() {
    return await this.qcParameterService.uomDropdown();
  }

  //!--> Equipment dropdown
  @Get('equipment-dropdown')
  async getEquipmentDropdown() {
    return await this.qcParameterService.equipmentDropdown();
  }

  //!--> Create QC parameter
  @Post('create-parameter')
  async createParameter(@Body() dto: QcParameterDto) {
    return await this.qcParameterService.createQcParameter(dto);
  }

  //!--> Paginate Parameters
  @HttpCode(200)
  @Post('all-parameters')
  async getParameters(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterQcParameterDto,
  ) {
    return await this.qcParameterService.getQcParameters(dto, pagination);
  }

  //!--> Parameter dropdown
  @Get('parameter-dropdown')
  async getParameterDropdown() {
    return await this.qcParameterService.getParameterDropdown();
  }

  //!--> Update qc parameter
  @Put('update-parameter/:id')
  async updateParameter(@Body() dto: QcParameterDto, @Param('id') id: string) {
    return await this.qcParameterService.editQcParameter(id, dto);
  }

  //!--> Delete qc parameter
  @Delete('delete-parameter/:id')
  async deleteParameter(@Param('id') id: string) {
    return await this.qcParameterService.deleteQcParameter(id);
  }
}
