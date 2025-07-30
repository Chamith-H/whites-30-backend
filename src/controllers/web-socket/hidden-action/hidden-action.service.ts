import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsS3BucketService } from 'src/config/services/aws-s3-bucket/aws-s3-bucket.service';
import { ActivatedUserDto } from 'src/controllers/auth/dto/activated-user.dto';
import { Role, RoleDocument } from 'src/schemas/user-management/role.schema';
import { User, UserDocument } from 'src/schemas/user-management/user.schema';
import { ChangedPermissionInterface } from './interfaces/changed-permissions.interface';
import { SocketGateway } from '../socket.gateway';
import { ChangedRoleInterface } from './interfaces/changed-role.interface';
import { ChangedUserInterface } from './interfaces/changed-user.interface';

@Injectable()
export class HiddenActionService {
  constructor(
    // DB models
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,

    // Common services
    private readonly s3BucketService: AwsS3BucketService,

    // Socket emitter gateway
    private readonly socketGateway: SocketGateway,
  ) {}

  //!--> RELOAD | Change user's name
  //!--> RELOAD | Change profile picture
  //!--> RELOAD | Change user's role
  async reload_when_userUpdatings(userId: string) {
    // Find requested user
    const user: any = await this.userModel
      .findOne({ _id: userId })
      .populate({ path: 'role', populate: { path: 'permissions' } });

    // Get AWS-S3 profile image
    const userProfileImage = await this.s3BucketService.getSingleFile(
      user.profileImage,
    );

    // Create activated user object
    const activeUser: ActivatedUserDto = {
      userId: user._id,
      name: user.name,
      type: user.type,
      roleId: user.role._id,
      roleName: user.role.name,
      profileImage: userProfileImage.url,
    };

    // Fetch access permission numbers
    const permissionNumbers = user.role?.permissions?.map((permission) => {
      return permission.permissionNo;
    });

    //-->
    const changedUser: ChangedUserInterface = {
      requestedUser: userId,
      userData: JSON.stringify(activeUser),
      accessNumbers: JSON.stringify(permissionNumbers),
    };

    // Send to SOCKET_GATEWAY
    this.socketGateway.refreshUser(changedUser);
  }

  //!--> RELOAD | Rename user role
  async reload_when_roleUpdatings(roleId: string) {
    // Find requested role
    const role = await this.roleModel.findOne({ _id: roleId });

    //-->
    const changedRole: ChangedRoleInterface = {
      requestedRole: roleId,
      roleName: role.name,
    };

    // Send to SOCKET_GATEWAY
    this.socketGateway.refreshRole(changedRole);
  }

  //!--> RELOAD | Change access permissions
  async reload_when_permissionUpdatings(roleId: string) {
    // Find requested role
    const role = await this.roleModel
      .findOne({ _id: roleId })
      .populate({ path: 'permissions' });

    // Fetch permission numbers
    const permissionNumbers = role?.permissions?.map((permission: any) => {
      return permission.permissionNo;
    });

    //-->
    const changedPermissions: ChangedPermissionInterface = {
      requestedRole: roleId,
      accessNumbers: JSON.stringify(permissionNumbers),
    };

    // Send to SOCKET_GATEWAY
    this.socketGateway.refreshPermissions(changedPermissions);
  }
}
