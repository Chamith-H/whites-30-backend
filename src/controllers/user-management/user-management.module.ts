import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { PermissionService } from './permission/permission.service';
import { PermissionController } from './permission/permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user-management/user.schema';
import { Role, RoleSchema } from 'src/schemas/user-management/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/schemas/user-management/permission.schema';
import { LogManagementModule } from '../log-management/log-management.module';
import { WebSocketModule } from '../web-socket/web-socket.module';
import { EmailSenderService } from 'src/config/services/email-sender/email-sender.service';
import { UniqueCodeGeneratorService } from 'src/config/services/unique-code-generator/unique-code-generator.service';
import { PaginationService } from 'src/config/services/table-pagination/table-pagination.service';
import { CheckUniquenessService } from 'src/config/services/uniqueness-checker/uniqueness-checker.service';
import { statusChangerService } from 'src/config/services/status-changer/status-changer.service';
import { AwsS3BucketService } from 'src/config/services/aws-s3-bucket/aws-s3-bucket.service';
import { EmailTemplateService } from 'src/config/templates/email.template';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    LogManagementModule,
    WebSocketModule,
  ],
  providers: [
    UserService,
    RoleService,
    PermissionService,
    EmailSenderService,
    UniqueCodeGeneratorService,
    CheckUniquenessService,
    statusChangerService,
    PaginationService,
    AwsS3BucketService,
    EmailSenderService,
    EmailTemplateService,
  ],
  controllers: [UserController, RoleController, PermissionController],
})
export class UserManagementModule {}
