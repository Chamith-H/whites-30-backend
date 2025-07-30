import { Module } from '@nestjs/common';
import { SystemLogService } from './system-log/system-log.service';
import { EditLogService } from './edit-log/edit-log.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SystemLog,
  SystemLogSchema,
} from 'src/schemas/log-management/system-log.schema';
import {
  EditLog,
  EditLogSchema,
} from 'src/schemas/log-management/edit.log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemLog.name, schema: SystemLogSchema },
      { name: EditLog.name, schema: EditLogSchema },
    ]),
  ],
  providers: [SystemLogService, EditLogService],
  exports: [SystemLogService, EditLogService],
})
export class LogManagementModule {}
