import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { WeighBridgeService } from './weigh-bridge.service';
import { Access } from 'src/config/decorators/access.decorator';
import { bPermissions } from 'src/config/enums/user-management/permission.enum';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { FilterGatePassDto } from './dto/filter-gate-pass.dto';
import { WeightRecordDto } from './dto/weight-record.dto';
import { GetUser } from 'src/config/decorators/user.decorator';

@Controller('weigh-bridge')
export class WeighBridgeController {
  constructor(private readonly weighBridgeService: WeighBridgeService) {}

  @Access(bPermissions.VIEW_ROLES_LIST)
  @HttpCode(200)
  @Post('all')
  async getRoles(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterGatePassDto,
  ) {
    return await this.weighBridgeService.getWeighbridges(dto, pagination);
  }

  @Post('weight-record')
  async recordWeight(@Body() dto: WeightRecordDto) {
    return await this.weighBridgeService.recordWeight(dto);
  }

  @Get('complete/:id')
  async completeWeight(@Param('id') id: string, @GetUser() userId: string) {
    return await this.weighBridgeService.completeTransaction(id, userId);
  }
}
