import { ConflictException } from '@nestjs/common';
import {
  CreateCheckUniqueStructure,
  UpdateCheckUniqueStructure,
} from './uniqueness-checker.interface';

export class CheckUniquenessService {
  //!--> Compare similar data for creating..........................................|
  async compare_forCREATE(checkUniqueModel: CreateCheckUniqueStructure) {
    const filter = {
      [checkUniqueModel.key]: checkUniqueModel.value,
    };

    const existDocument = await checkUniqueModel.dataModel
      .findOne(filter)
      .collation({ locale: 'en', strength: 2 });

    if (existDocument) {
      throw new ConflictException(checkUniqueModel.error);
    }
  }

  //!--> Compare similar data for updating..........................................|
  async compare_forUPDATE(checkUniqueModel: UpdateCheckUniqueStructure) {
    const filter = {
      [checkUniqueModel.key]: checkUniqueModel.value,
    };

    const existDocument = await checkUniqueModel.dataModel
      .findOne(filter)
      .collation({ locale: 'en', strength: 2 });

    if (existDocument && existDocument.id !== checkUniqueModel.id) {
      throw new ConflictException(checkUniqueModel.error);
    }
  }
}
