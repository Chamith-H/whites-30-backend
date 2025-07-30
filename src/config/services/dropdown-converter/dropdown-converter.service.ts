import { DropdownConverterInterface } from './dropdown-converter.interface';

export class DropdownConverterService {
  //!--> Return default structure.....................................................|
  async defaultStructure(
    data: any[],
    objectDefinition: DropdownConverterInterface,
  ) {
    const modifiedStructure = data.map((item) => ({
      _id: item[objectDefinition._id],
      name: item[objectDefinition.name],
    }));

    return await modifiedStructure;
  }

  //!--> Return Name = name + _id structure...........................................|
  async nameFirstStructure(
    data: any[],
    objectDefinition: DropdownConverterInterface,
  ) {
    const modifiedStructure = data.map((item) => ({
      _id: item[objectDefinition._id],
      name: item[objectDefinition.name] + ` - (${item[objectDefinition._id]})`,
    }));

    return await modifiedStructure;
  }

  //!--> Return Name = _id + name structure...........................................|
  async valueFirstStructure(
    data: any[],
    objectDefinition: DropdownConverterInterface,
  ) {
    const modifiedStructure = data.map((item) => ({
      _id: item[objectDefinition._id],
      name: item[objectDefinition._id] + ` - (${item[objectDefinition.name]})`,
    }));

    return await modifiedStructure;
  }
}
