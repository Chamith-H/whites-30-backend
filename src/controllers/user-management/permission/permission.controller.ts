import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { GetPermissionDto } from './dto/get-permission.dto';
import { Access } from 'src/config/decorators/access.decorator';
import { bPermissions } from 'src/config/enums/user-management/permission.enum';

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  //!--> Get user permissions according to Module and Sections..............................|
  @Access(bPermissions.VIEW_PERMISSION_LIST)
  @Post('all')
  async getPermissions(@Body() dto: GetPermissionDto) {
    return await this.permissionService.getPermissions(dto);
  }
}
