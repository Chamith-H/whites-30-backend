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
import { GatePassService } from './gate-pass.service';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { FilterPoDto } from './dto/filter-po.dto';
import { GatePassDto } from './dto/gate-pass.dto';
import { GetUser } from 'src/config/decorators/user.decorator';
import { GatePassFullDto } from './dto/gate-pass-full.dto';
import { FilterGAtePassDto } from './dto/filter-gatepass.dto';

@Controller('gate-pass')
export class GatePassController {
  constructor(private readonly gatePassService: GatePassService) {}

  //!--> Get Items | With pagination............................................................|
  @HttpCode(200)
  @Post('all-po')
  async getItemData(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterPoDto,
  ) {
    return await this.gatePassService.getPOs(dto, pagination);
  }

  @Post('create')
  async createGatePass(@Body() dto: GatePassDto, @GetUser() userId: string) {
    return await this.gatePassService.gateCheckIn(dto, userId);
  }

  @Get('check-po/:po')
  async checkPo(@Param('po') po: string) {
    return await this.gatePassService.checkPo(Number(po));
  }

  @Put('update/:id')
  async updateGatePass(@Param('id') id: string, @Body() dto: GatePassFullDto) {
    return await this.gatePassService.updateGatePass(id, dto);
  }

  @HttpCode(200)
  @Post('all')
  async getRGatePasses(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterGAtePassDto,
  ) {
    return await this.gatePassService.getGatePassWithPagination(
      dto,
      pagination,
    );
  }

  @Get('gate-pass/:id')
  async getGatePass(@Param('id') id: string) {
    return await this.gatePassService.getSelectedGatePass(id);
  }

  @Delete('remove/:id')
  async deleteGatePass(@Param('id') id: string) {
    return await this.gatePassService.deleteGatePass(id);
  }

  @Get('gate-pass-view/:id')
  async getGatePassView(@Param('id') id: string) {
    return await this.gatePassService.viewGatePass(id);
  }
}
