import {
  MAX_NAME_LEN,
  MIN_PARTITION_SIZE,
  PartitionType,
  PartitionSubType,
  PartitionSubTypeApp,
  PartitionFlags,
} from './constants';

import {
  PartitionRecord,
} from './csv';

import {
  isValidType,
  isValidSubType,
} from './validation';

//------------------------------------------------------------------------------
class Partition {
  private record : PartitionRecord;

  constructor(name : string) {
    this.record = {
      name: '',
      type: PartitionType.app,
      subType: PartitionSubTypeApp.factory,
      offset: 0,
      size: MIN_PARTITION_SIZE,
      flags: [],
    };
    this.name = name;
  }

  get name() : string {
    return this.record.name;
  }

  set name(newName: string) {
    this.record.name = newName.slice(0, MAX_NAME_LEN);
  }

  get type() : PartitionType {
    return this.record.type;
  }

  set type(newType: PartitionType) {
    if (!isValidType(newType)) {
      throw new RangeError('Invalid type.');
    }
    if (this.record.type === newType) {
      return;
    }
    this.record.type = newType;
    this.record.subType = 0;
  }

  get subType() : PartitionSubType {
    return this.record.subType;
  }

  set subType(newSubType: PartitionSubType) {
    if (!isValidSubType(newSubType, this.type)) {
      throw new RangeError('Invalid subType.');
    }
    this.record.subType = newSubType;
  }

  get offset() : number {
    return this.record.offset;
  }

  get size() : number {
    return this.record.size;
  }

  get encrypted() : boolean {
    return this.record.flags.includes(PartitionFlags.encrypted);
  }

  set encrypted(newValue : boolean) {
    const index = this.record.flags.indexOf(PartitionFlags.encrypted);
    if (newValue && index === -1) {
      this.record.flags.push(PartitionFlags.encrypted);
    } else if (!newValue && index !== -1) {
      this.record.flags.splice(index, 1);
    }
  }

  get readonly() : boolean {
    return this.record.flags.includes(PartitionFlags.readonly);
  }

  set readonly(newValue : boolean) {
    const index = this.record.flags.indexOf(PartitionFlags.readonly);
    if (newValue && index === -1) {
      this.record.flags.push(PartitionFlags.readonly);
    } else if (!newValue && index !== -1) {
      this.record.flags.splice(index, 1);
    }
  }
}

export default Partition;
