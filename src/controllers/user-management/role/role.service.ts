import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleType } from 'src/config/enums/user-management/role.enum';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { UniqueCodeGeneratorInterface } from 'src/config/services/unique-code-generator/unique-code-generator.interface';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import {
  CreateCheckUniqueStructure,
  UpdateCheckUniqueStructure,
} from 'src/config/services/uniqueness-checker/uniqueness-checker.interface';
import { CheckUniquenessService } from 'src/config/services/uniqueness-checker/uniqueness-checker.service';
import { EditLogService } from 'src/controllers/log-management/edit-log/edit-log.service';
import { SystemLogStructure } from 'src/controllers/log-management/system-log/dto/system-log-structure.dto';
import { SystemLogService } from 'src/controllers/log-management/system-log/system-log.service';
import { HiddenActionService } from 'src/controllers/web-socket/hidden-action/hidden-action.service';
import { Role, RoleDocument } from 'src/schemas/user-management/role.schema';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { RoleDto } from './dto/role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { TablePaginationInterface } from 'src/config/services/table-pagination/table-pagination.interface';
import { EditLogDto } from 'src/controllers/log-management/edit-log/dto/edit-log.dto';
import { EditLogOptions } from 'src/config/enums/log-management/edit-log.enum';
import { DropdownStructure } from 'src/config/interfaces/drop-down.structure';
import { UserType } from 'src/config/enums/user-management/user.enum';
import { StatusChangerInterface } from 'src/config/services/status-changer/status-changer.interface';
import { statusChangerService } from 'src/config/services/status-changer/status-changer.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class RoleService {
  constructor(
    // DB models
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    // Common services
    private readonly checkUniquenessService: CheckUniquenessService,
    private readonly uniqueCodeGenetatorService: UniqueCodeGeneratorService,
    private readonly paginationService: PaginationService,
    private readonly statusChangerService: statusChangerService,
    private readonly hiddenActionService: HiddenActionService,

    // Exportable services
    private readonly systemLogService: SystemLogService,
    private readonly editLogService: EditLogService,
  ) {}

  //!--> Create new user role.................................................................|
  async createRole(dto: RoleDto, user: string) {
    // Initialize data structure to check uniqueness | for create
    const checkingObject: CreateCheckUniqueStructure = {
      dataModel: this.roleModel,
      key: 'name',
      value: dto.name,
      error: 'This user role has been already created!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forCREATE(checkingObject);

    // Initialize data structure for creating unique code
    const uniqueCodeObject: UniqueCodeGeneratorInterface = {
      dataModel: this.roleModel,
      prefix: 'R-',
    };

    // Create new unique code
    const uniqueCode =
      await this.uniqueCodeGenetatorService.create_newUniqueCode(
        uniqueCodeObject,
      );

    // Initialize data structure for creating data document
    const newRole: Role = {
      number: uniqueCode.requestNumber,
      roleId: uniqueCode.requestId,
      ...dto,
      type: RoleType.CUSTOM_ROLE,
      userCount: 0,
      permissions: [],
    };

    // Initialize data structure for creating system log
    const systemLog: SystemLogStructure = {
      userId: user,
      target: 'Role',
      data: newRole,
      successMessage: 'User role created successfully!',
      errorMessage: 'Cannot create this role!',
    };

    // Create system log and insert document
    return await this.systemLogService.add_toSystemLog(
      this.roleModel,
      systemLog,
    );
  }

  //!--> Get roles with filters & paginations.............................................|
  async getRoles(dto: FilterRoleDto, pagination: PaginationStructure) {
    // Name searching matched given string
    if (dto.name) {
      const regex = new RegExp(dto.name, 'i');
      dto.name = regex;
    }

    // DB data filtering query
    const list = await this.roleModel
      .find(dto)
      .skip(pagination.offset)
      .limit(pagination.limit)
      .sort({ number: -1 });

    //Pass to get pagination
    const currentPage: TablePaginationInterface = {
      data: list,
      model: this.roleModel,
      query: dto,
      currentPage: pagination.page,
      dataLimit: pagination.limit,
    };

    //-->
    return await this.paginationService.render_toPAGE(currentPage);
  }

  //!--> Update role data................................................................|
  async updateRole(id: string, dto: RoleDto, userId: string) {
    // Check role, for update
    const isExist = await this.roleModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user role!');
    }

    // Initialize data structure to check uniqueness | for Edit
    const checkingObject: UpdateCheckUniqueStructure = {
      id: id,
      dataModel: this.roleModel,
      key: 'name',
      value: dto.name,
      error: 'This user role is already exist!',
    };

    // Check for creating duplicate data
    await this.checkUniquenessService.compare_forUPDATE(checkingObject);

    // Initialize data structure for edit log
    const editLog: EditLogDto = {
      method: EditLogOptions.UPDATE_PROPERTIES,
      userId: userId,
      target: 'Role',
      origin: id,
      data: dto,
      successMessage: 'User role updated successfully!',
      errorMessage: 'Cannot update this user role!',
    };

    //-->
    const response = await this.editLogService.add_toEditLog(
      this.roleModel,
      editLog,
    );

    // Pass to trigger live action
    if (response.message) {
      await this.hiddenActionService.reload_when_roleUpdatings(id);
    }

    return response;
  }

  //!--> Get roles for dropdown........................................................|
  async getRolesForDropdown() {
    // Get Array | only key & value
    const keyValues: DropdownStructure[] = await this.roleModel
      .find({ type: RoleType.CUSTOM_ROLE, status: true })
      .select('_id name');

    //-->
    return keyValues;
  }

  //!--> Get roles for permission.......................................................|
  async getRolesForPermissions(id: string) {
    return await this.roleModel
      .find({
        type: RoleType.CUSTOM_ROLE,
        _id: { $ne: id },
      })
      .select('_id name');
  }

  //!--> Get selected permission asigned to role..............................................|
  async getSelectedRolePermissions(id: string) {
    return await this.roleModel.findById(id).select('permissions');
  }

  //!--> Update permissions...................................................................|
  async updatePermissions(id: string, dto: UpdatePermissionDto) {
    // Update permissions to selected role
    const updater = await this.roleModel.findByIdAndUpdate(id, dto);

    // Handle updating error
    if (!updater) {
      throw new BadRequestException('Cannot update permissions');
    }

    // Send data as a hidden action | to live trigger
    await this.hiddenActionService.reload_when_permissionUpdatings(id);

    //-->
    return await this.roleModel.findById(id);
  }

  //!--> Change role status | Active -> Inactive | Inactive -> Active...................|
  async changeRoleStatus(id: string, userId: string) {
    // Get requested user data
    const requestedUser: User = await this.userModel.findOne({ _id: userId });

    // Handle user permissions to change role status
    if (
      requestedUser.role === id &&
      requestedUser.type !== UserType.SUPER_USER
    ) {
      throw new ConflictException('You cannot change your role!');
    }

    // Check role, for change status
    const isExist = await this.roleModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user role!');
    }

    // Initialize data structure for change status
    const changeStatusModel: StatusChangerInterface = {
      targetId: isExist._id,
      target: 'user role',
      dataModel: this.roleModel,
      currentStatus: isExist.status,
    };

    //-->
    return await this.statusChangerService.changeStatus(changeStatusModel);
  }

  //!--> Delete user role..............................................................|
  async deleteRole(id: string, userId: string) {
    // Get requested user data
    const requestedUser = await this.userModel.findOne({ _id: userId });

    // Handle user permissions to delete role
    if (
      requestedUser.role === id &&
      requestedUser.type !== UserType.SUPER_USER
    ) {
      throw new ConflictException('You cannot delete your role!');
    }

    // Check role, for delete
    const isExist = await this.roleModel.findOne({ _id: id });
    if (!isExist) {
      throw new ConflictException('Cannot find this user role!');
    }

    // Check is this role asigned to users
    if (isExist.userCount > 0) {
      throw new ConflictException(
        `Cannot delete! This role has been assigned to ${isExist.userCount} users`,
      );
    }

    // DB request to delete
    const deleteRequest = await this.roleModel.deleteOne({ _id: id });

    // Handle server errors
    if (deleteRequest.deletedCount !== 1) {
      throw new BadRequestException('Cannot delete this role!');
    }

    //-->
    return { message: 'User role deleted successfully!' };
  }
}
