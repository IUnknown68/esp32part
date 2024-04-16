import 'jest-extended';

import {
  PARTITION_TABLE_SIZE,
  OFFSET_PART_TABLE,
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
} from './constants';

import {
  isValidType,
  isValidSubType,
  validatePartition,
  validatePartitionTable,
} from './validation';

import {
  SAMPLE_PARTITION_RECORD,
} from './testdata';

import {
  clonePartitionRecord,
} from './PartitionRecord';

const INVALID_APP_SUBTYPE = 0x21;
const INVALID_DATA_SUBTYPE = 0x40;

describe('isValidType', () => {
  describe('returns true, when', () => {
    it('any number between 0 and 254 is passed', () => {
      expect(isValidType(0)).toBeTruthy();
      expect(isValidType(1)).toBeTruthy();
      expect(isValidType(10)).toBeTruthy();
      expect(isValidType(254)).toBeTruthy();
    });
  });

  describe('returns false, when', () => {
    it('a negative number is passed', () => {
      expect(isValidType(-1)).toBeFalsy();
    });
    it('a number > 254 is passed', () => {
      expect(isValidType(255)).toBeFalsy();
    });
    it('a string is passed', () => {
      expect(isValidType('2')).toBeFalsy();
    });
    it('a float is passed', () => {
      expect(isValidType(2.3)).toBeFalsy();
    });
  });
});

describe('isValidSubType', () => {
  describe('returns true, when', () => {
    it('for a type "app", any of PartitionSubTypeApp is passed', () => {
      expect(isValidSubType(PartitionSubTypeApp.factory, PartitionType.app)).toBeTruthy();
      expect(isValidSubType(PartitionSubTypeApp.ota_4, PartitionType.app)).toBeTruthy();
      expect(isValidSubType(PartitionSubTypeApp.test, PartitionType.app)).toBeTruthy();
    });
    it('for a type "data", any of PartitionSubTypeData is passed', () => {
      expect(isValidSubType(PartitionSubTypeData.ota, PartitionType.data)).toBeTruthy();
      expect(isValidSubType(PartitionSubTypeData.coredump, PartitionType.data)).toBeTruthy();
      expect(isValidSubType(PartitionSubTypeData.littlefs, PartitionType.data)).toBeTruthy();
    });
    it('for a custom type, any number between 0 and 254 is passed', () => {
      expect(isValidSubType(0)).toBeTruthy();
      expect(isValidSubType(1)).toBeTruthy();
      expect(isValidSubType(10)).toBeTruthy();
      expect(isValidSubType(254)).toBeTruthy();
    });
  });

  describe('returns false, when', () => {
    it('for a type "app", any other than PartitionSubTypeApp is passed', () => {
      expect(isValidSubType(INVALID_APP_SUBTYPE, PartitionType.app)).toBeFalsy();
    });
    it('for a type "data", any other than PartitionSubTypeData is passed', () => {
      expect(isValidSubType(INVALID_DATA_SUBTYPE, PartitionType.data)).toBeFalsy();
    });
    it('for a custom type, a number < 0 is passed', () => {
      expect(isValidSubType(-1)).toBeFalsy();
    });
    it('for a custom type, a number > 254 is passed', () => {
      expect(isValidSubType(255)).toBeFalsy();
    });
    it('for a custom type, a float is passed', () => {
      expect(isValidSubType(1.2)).toBeFalsy();
    });
  });
});

describe('validatePartition()', () => {
  describe('throws an error, when', () => {
    it('a record overlaps with the offset', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = -1;
      expect(() => {
        validatePartition(record);
      }).toThrow();
    });

    it('a record overlaps with the offset passed', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 1;
      expect(() => {
        validatePartition(record, 2);
      }).toThrow();
    });

    it('a record has a size <= 0', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.size = 0;
      expect(() => {
        validatePartition(record);
      }).toThrow();
      record.size = -1;
      expect(() => {
        validatePartition(record);
      }).toThrow();
    });
  });

  describe('does not throw, when', () => {
    it('a record starts at the offset', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 0;
      expect(() => {
        validatePartition(record);
      }).not.toThrow();
    });

    it('a record starts at the offset passed', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 2;
      expect(() => {
        validatePartition(record, 2);
      }).not.toThrow();
    });
  });

  it('returns the end of the table', () => {
    const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record.offset = 0;
    const result = validatePartition(record);
    expect(result).toBe(record.size);
  });
});

describe('validatePartitionTable()', () => {
  describe('throws an error, when', () => {
    it('a record overlaps with the previous record', () => {
      const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record2.offset = record1.offset + record1.size - 1;
      expect(() => {
        validatePartitionTable([record1, record2]);
      }).toThrow();
    });
  });

  describe('does not throw, when', () => {
    it('records touch', () => {
      const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record2.offset = record1.offset + record1.size;
      expect(() => {
        validatePartitionTable([record1, record2]);
      }).not.toThrow();
    });
  });

  it('sets offsets which are 0', () => {
    const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record2.offset = 0;
    validatePartitionTable([record1, record2]);
    expect(record2.offset).toBe(record1.offset + record1.size);
  });

  it('aligns an offset with the next alignment boundary', () => {
    const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record1.size = 0x10;
    const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record2.offset = 0;
    validatePartitionTable([record1, record2]);
    expect(record2.offset).toBe(OFFSET_PART_TABLE + PARTITION_TABLE_SIZE + 0x1000);
  });
});
