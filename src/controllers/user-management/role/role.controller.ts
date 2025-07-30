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
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { GetUser } from 'src/config/decorators/user.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { FilterRoleDto } from './dto/filter-role.dto';
import { Access } from 'src/config/decorators/access.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { bPermissions } from 'src/config/enums/user-management/permission.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //!--> Create new role........................................................................|
  @Access(bPermissions.ADD_ROLE)
  @Post('create')
  async createRole(@Body() dto: RoleDto, @GetUser() user: string) {
    return await this.roleService.createRole(dto, user);
  }

  //!--> Get all roles | with pagination........................................................|
  @Access(bPermissions.VIEW_ROLES_LIST)
  @HttpCode(200)
  @Post('all')
  async getRoles(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterRoleDto,
  ) {
    return await this.roleService.getRoles(dto, pagination);
  }

  //!--> Update role...........................................................................|
  @Access(bPermissions.EDIT_ROLE)
  @Put('edit/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() dto: RoleDto,
    @GetUser() userId: string,
  ) {
    return await this.roleService.updateRole(id, dto, userId);
  }

  //!--> Change role status...................................................................|
  @Access(bPermissions.CHANGE_ROLE_STATUS)
  @Get('change/:id')
  async changeStatus(@Param('id') id: string, @GetUser() userId: string) {
    return await this.roleService.changeRoleStatus(id, userId);
  }

  //!--> Delete role..........................................................................|
  @Access(bPermissions.DELETE_ROLE)
  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string, @GetUser() userId: string) {
    return await this.roleService.deleteRole(id, userId);
  }

  //!--> Get roles for manage permissions.....................................................|
  @Access(bPermissions.VIEW_PERMISSION_LIST)
  @Get('customs/:id')
  async getCustomRoles(@Param('id') id: string) {
    return await this.roleService.getRolesForPermissions(id);
  }

  //!--> Get permissions list for selected role...............................................|
  @Access(bPermissions.VIEW_PERMISSION_LIST)
  @Get('permissions/:id')
  async selectedRolePermissions(@Param('id') id: string) {
    return await this.roleService.getSelectedRolePermissions(id);
  }

  //!--> Change permissions for selected role.................................................|
  @Access(bPermissions.MANAGE_PERMISSIONS)
  @Put('manage/:id')
  async ManagePermissions(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return await this.roleService.updatePermissions(id, dto);
  }

  //!--> Get roles for dropdown..............................................................|
  @Get('dropdown')
  async getRolesForDropdown() {
    return await this.roleService.getRolesForDropdown();
  }
}
