import { Module } from '@nestjs/common';
import { HiddenActionService } from './hidden-action/hidden-action.service';
import { NotificationService } from './notification/notification.service';
import { SocketGateway } from './socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user-management/user.schema';
import { Role, RoleSchema } from 'src/schemas/user-management/role.schema';
import { AwsS3BucketService } from 'src/config/services/aws-s3-bucket/aws-s3-bucket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    SocketGateway,
  ],
  providers: [
    SocketGateway,
    HiddenActionService,
    NotificationService,
    AwsS3BucketService,
  ],
  exports: [HiddenActionService],
})
export class WebSocketModule {}
