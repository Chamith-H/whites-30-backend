import { UniqueCodeGeneratorInterface } from './unique-code-generator.interface';

export class UniqueCodeGeneratorService {
  //!--> Request latest number..........................................................|
  async create_newUniqueCode(uniqueCodeModel: UniqueCodeGeneratorInterface) {
    try {
      const currentReq = await uniqueCodeModel.dataModel.aggregate([
        {
          $group: {
            _id: null,
            maxNum: { $max: '$number' },
          },
        },
      ]);

      const newRequestNumber = currentReq[0].maxNum + 1;
      return await this.generate_NewId(
        newRequestNumber,
        uniqueCodeModel.prefix,
      );
    } catch (error) {
      const newRequestNumber = 1;
      return await this.generate_NewId(
        newRequestNumber,
        uniqueCodeModel.prefix,
      );
    }
  }

  //!--> New unique code creation.......................................................|
  generate_NewId(reqNumber: number, prefixStr: string) {
    let str_reqNumber = reqNumber.toString();

    if (str_reqNumber.length >= 6) {
      return {
        requestNumber: reqNumber,
        requestId: prefixStr + str_reqNumber,
      };
    } else {
      let zeroCount = 6 - str_reqNumber.length;
      let setRequestId = '0'.repeat(zeroCount) + str_reqNumber;

      return {
        requestNumber: reqNumber,
        requestId: prefixStr + setRequestId,
      };
    }
  }
}
