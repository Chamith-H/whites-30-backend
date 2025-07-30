import { BadRequestException } from '@nestjs/common';
import { StatusChangerInterface } from './status-changer.interface';

export class statusChangerService {
  async changeStatus(changeStatusModel: StatusChangerInterface) {
    // Identify current action
    let changingAction = null;

    if (changeStatusModel.currentStatus === false) {
      changingAction = 'enable';
    } else {
      changingAction = 'disable';
    }

    // Request to DB for change status
    const statusChangeRequest = await changeStatusModel.dataModel.updateOne(
      { _id: changeStatusModel.targetId },
      { $set: { status: !changeStatusModel.currentStatus } },
    );

    if (statusChangeRequest.modifiedCount !== 1) {
      throw new BadRequestException(
        `Cannot ${changingAction} this ${changeStatusModel.target}!`,
      );
    }

    return {
      message: `${changeStatusModel.target} ${changingAction} successfully!`,
    };
  }
}
