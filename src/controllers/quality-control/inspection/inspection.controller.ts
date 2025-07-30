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
import { InspectionService } from './inspection.service';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { ObservedValuesDto } from './dto/update-obsereds.dto';
import { GetUser } from 'src/config/decorators/user.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { InspectionDto } from './dto/inspection.dto';
import { StartingConfDto } from './dto/starting-conf.dto';
import { SampleDto } from './dto/sample.dto';
import { StartingObserverDto } from './dto/starting-observer.dto';
import { SetActionDto } from './dto/set-action.dto';
import { SaveDataDto } from './dto/save-data.dto';

@Controller('inspection')
export class InspectionController {
  constructor(private inspectionService: InspectionService) {}

  //!--> Get inspection list
  @HttpCode(200)
  @Post('all')
  async getParameters(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: InspectionDto,
  ) {
    return await this.inspectionService.gerPendingInspections(dto, pagination);
  }

  //!--> Get starting confs
  @Post('start-conf')
  async getStartConf(@Body() dto: StartingConfDto) {
    return await this.inspectionService.checkingStartingConf(dto);
  }

  //!--> Start Inspection
  @Post('start')
  async startInspection(@Body() dto: StartInspectionDto) {
    return await this.inspectionService.startQcInspection(dto);
  }

  //!--> Start Configurations
  @Post('start-config')
  async checkingItems(@Body() dto: StartingObserverDto) {
    return await this.inspectionService.getCheckingValues(dto);
  }

  //!--> Update observeds
  @Post('update-observeds')
  async updateObserveds(
    @Body() dto: ObservedValuesDto,
    @GetUser() userId: string,
  ) {
    return await this.inspectionService.updateObserveds(dto, userId);
  }

  //!--> Create samples
  @Post('create-samples')
  async createSamples(@Body() dto: SampleDto, @GetUser() userId: string) {
    return await this.inspectionService.createSamples(dto, userId);
  }

  @Post('save-data')
  async savedata(@Body() dto: SaveDataDto) {
    return await this.inspectionService.saveData(dto);
  }

  //!--> Set action
  @Put('set-action/:id')
  async setAction(
    @Param('id') id: string,
    @Body() dto: SetActionDto,
    @GetUser() userId: string,
  ) {
    return await this.inspectionService.setAction(id, dto, userId);
  }

  @Post('upload-doc')
  async uploadImage(@Body() dto: any) {
    return await this.inspectionService.saveInspectImg(dto);
  }

  @Get('get-doc/:id')
  async viewDocs(@Param('id') id: string) {
    return await this.inspectionService.getDocuments(id);
  }

  @Delete('remove-doc/:id')
  async removeDoc(@Param('id') id: string) {
    const deleter = await this.inspectionService.deleteDocument(id);

    if (deleter) {
      return {
        message: 'Document removed successfully!',
      };
    }
  }
}
