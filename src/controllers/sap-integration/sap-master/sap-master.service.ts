import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SapMaster,
  SapMasterDocument,
} from 'src/schemas/common/sap-master.schema';
import { MasterItemsDto } from './dto/master-items.dto';

@Injectable()
export class SapMasterService {
  constructor(
    @InjectModel(SapMaster.name)
    private readonly masterModel: Model<SapMasterDocument>,
  ) {}

  //!--> Get sap master data for items
  //Nes master
  async get_itemMsterData() {
    const itemMasters = await this.masterModel.find({ target: 'Items' });

    const itemGroups = itemMasters.find(
      (master: SapMaster) => master.name === 'Item-Groups',
    );

    const uomGroups = itemMasters.find(
      (master: SapMaster) => master.name === 'UOM-Groups',
    );

    const numberSequences = itemMasters.find(
      (master: SapMaster) => master.name === 'Number-Sequence',
    );

    return {
      itemGroups: itemGroups.data,
      uomGroups: uomGroups.data,
      numberSeqs: numberSequences.data,
    };
  }

  //!--> Get actual data
  async get_actualData(dto: MasterItemsDto) {
    const itemMasters = await this.masterModel.find({ target: 'Items' });

    const itemGroups = itemMasters.find(
      (master: SapMaster) => master.name === 'Item-Groups',
    );

    const uomGroups = itemMasters.find(
      (master: SapMaster) => master.name === 'UOM-Groups',
    );

    const numberSequences = itemMasters.find(
      (master: SapMaster) => master.name === 'Number-Sequence',
    );

    const itemGroupsArr = itemGroups.data;
    const uomGroupsArr = uomGroups.data;
    const numberSeqs = numberSequences.data;

    const selectedGroup = itemGroupsArr.find(
      (group) => group._id === dto.ItemsGroupCode,
    );

    const selectedUomGroup = uomGroupsArr.find(
      (group) => group._id === dto.UoMGroupEntry,
    );

    dto.UoMGroupEntry = selectedUomGroup?.name || 'N/A';
    dto.ItemsGroupCode = selectedGroup?.name || 'N/A';
    dto.ItemType = dto.ItemType.replace('it', '');
    dto.GLMethod = dto.GLMethod.replace(/.*_/, '');
    dto.CostAccountingMethod = dto.CostAccountingMethod.replace(/.*_/, '');
    dto.PlanningSystem = dto.PlanningSystem.replace(/.*_/, '');
    dto.ProcurementMethod = dto.ProcurementMethod.replace(/.*_/, '');
    dto.IssueMethod = dto.IssueMethod.replace(/.*_/, '');

    return dto;
  }
}
