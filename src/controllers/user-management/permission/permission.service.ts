import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/schemas/user-management/permission.schema';
import { GetPermissionDto } from './dto/get-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  //!--> Get permission according to selected module and section..............................|
  async getPermissions(dto: GetPermissionDto) {
    if (!dto.module || dto.module === 0) {
      delete dto.module;
    }
    if (!dto.section || dto.section === 0) {
      delete dto.section;
    }

    return await this.permissionModel.find(dto);
  }
}
