import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SystemLog,
  SystemLogDocument,
} from 'src/schemas/log-management/system-log.schema';
import { SystemLogDto } from './dto/system-log.dto';
import { SystemLogModel } from './dto/system-log-model.dto';

@Injectable()
export class SystemLogService {
  constructor(
    @InjectModel(SystemLog.name)
    private readonly systemLogModel: Model<SystemLogDocument>,
  ) {}

  async add_toSystemLog(dataModel: any, dto: SystemLogDto) {
    //!--> Insert document to selected collection....................................|
    const newData = dataModel(dto.data);
    const response = await newData.save();

    if (!response) {
      throw new BadRequestException(dto.errorMessage);
    }

    //!-->
    const systemLog: SystemLogModel = {
      origin: response._id,
      target: dto.target,
      createdBy: dto.userId,
      createdDate: new Date(),
    };

    const newSystemLog = new this.systemLogModel(systemLog);
    await newSystemLog.save();

    return { message: dto.successMessage };
  }
}
