import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParsedBody } from 'src/config/decorators/parsed-body.decorator';
import { UserDto } from './dto/user.dto';
import { GetUser } from 'src/config/decorators/user.decorator';
import { Pagination } from 'src/config/decorators/pagination.decorator';
import { PaginationStructure } from 'src/config/interfaces/pagination.structure';
import { FilterObject } from 'src/config/decorators/filter.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { Access } from 'src/config/decorators/access.decorator';
import { bPermissions } from 'src/config/enums/user-management/permission.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //!--> Create new user.........................................................................|
  @Access(bPermissions.ADD_USER)
  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 1 }]))
  async createUser(
    @UploadedFiles() files: Express.Multer.File[],
    @ParsedBody() dto: UserDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.createUser(dto, files, userId);
  }

  //!--> Get all users | with pagination.........................................................|
  @Access(bPermissions.VIEW_USERS_LIST)
  @HttpCode(200)
  @Post('all')
  async getRoles(
    @Pagination() pagination: PaginationStructure,
    @FilterObject() dto: FilterUserDto,
  ) {
    return await this.userService.getUsers(dto, pagination);
  }

  //!--> Get user data | for detail view.........................................................|
  @Access(bPermissions.DETAIL_USER)
  @Get('detailed-user/:id')
  async getUserForView(@Param('id') id: string) {
    return await this.userService.getSingleUserForView(id);
  }

  //!--> Get user data | for edit................................................................|
  @Access(bPermissions.EDIT_USER)
  @Get('for-edit/:id')
  async getUserForEdit(@Param('id') id: string) {
    return await this.userService.getSingleUserForEdit(id);
  }

  //!--> Update user............................................................................|
  @Access(bPermissions.EDIT_USER)
  @Put('edit/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 1 }]))
  async updateUser(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @ParsedBody() dto: UserDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.updateUser(id, dto, files, userId);
  }

  //!--> Change user status....................................................................|
  @Access(bPermissions.CHANGE_USER_STATUS)
  @Get('change/:id')
  async changeStatus(@Param('id') id: string, @GetUser() userId: string) {
    return await this.userService.changeUserStatus(id, userId);
  }

  //!--> Delete user..........................................................................|
  @Access(bPermissions.DELETE_USER)
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string, @GetUser() userId: string) {
    return await this.userService.deleteUser(id, userId);
  }
}
