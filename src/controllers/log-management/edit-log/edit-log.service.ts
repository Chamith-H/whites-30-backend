import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EditLog,
  EditLogDocument,
} from 'src/schemas/log-management/edit.log.schema';
import { EditLogDto } from './dto/edit-log.dto';
import { EditLogModel } from './dto/edit-log-model.dto';
import { EditLogOptions } from 'src/config/enums/log-management/edit-log.enum';

@Injectable()
export class EditLogService {
  constructor(
    @InjectModel(EditLog.name)
    private readonly editLogModel: Model<EditLogDocument>,
  ) {}

  async add_toEditLog(dataModel: any, dto: EditLogDto) {
    //!--> Update multiple attributes.....................................................|
    if (dto.method === EditLogOptions.UPDATE_PROPERTIES) {
      const updateStatus = await dataModel.updateOne(
        { _id: dto.origin },
        { $set: dto.data },
      );

      if (updateStatus.matchedCount !== 1) {
        throw new UnprocessableEntityException(dto.errorMessage);
      }
    }

    //!--> Push a property to single array type attribute................................|
    else if (dto.method === EditLogOptions.PUSH_TO_ARRAY) {
      const updateStatus = await dataModel.updateOne(
        { _id: dto.origin },
        { $push: dto.data },
      );

      if (updateStatus.matchedCount !== 1) {
        throw new UnprocessableEntityException(dto.errorMessage);
      }
    }

    //!--> Pull a property from single array type attribute..............................|
    else if (dto.method === EditLogOptions.PULL_FROM_ARRAY) {
      const updateStatus = await dataModel.updateOne(
        { _id: dto.origin },
        { $pull: dto.data },
      );

      if (updateStatus.matchedCount !== 1) {
        throw new UnprocessableEntityException(dto.errorMessage);
      }
    }

    //!-->
    const editLog: EditLogModel = {
      origin: dto.origin,
      data: dto.data,
      target: dto.target,
      editBy: dto.userId,
      editedDate: new Date(),
    };

    const newEditLog = new this.editLogModel(editLog);
    await newEditLog.save();

    return { message: dto.successMessage };
  }
}
