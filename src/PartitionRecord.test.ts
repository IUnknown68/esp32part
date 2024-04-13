import 'jest-extended';

import {
  PartitionType,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import PartitionRecord, {
  clonePartitionRecord,
} from './PartitionRecord';

const sampleRecord : PartitionRecord = {
  name: 'nvs',
  type: PartitionType.data,
  subType: PartitionSubTypeData.nvs,
  offset: 0x9000,
  size: 0x5000,
  flags: [PartitionFlags.encrypted],
  autoOffset: false,
};

describe('clonePartitionRecord', () => {
  describe('returns an Object, that ', () => {
    it('has all properties of the source', () => {
      const result = clonePartitionRecord(sampleRecord);
      expect(result).toContainAllEntries([
        ['name', 'nvs'],
        ['type', PartitionType.data],
        ['subType', PartitionSubTypeData.nvs],
        ['offset', 0x9000],
        ['size', 0x5000],
        ['flags', [PartitionFlags.encrypted]],
        ['autoOffset', false],
      ]);
    });

    it('is not identical to the source', () => {
      const result = clonePartitionRecord(sampleRecord);
      expect(result).not.toBe(sampleRecord);
      expect(result.flags).not.toBe(sampleRecord.flags);
    });
  });

  describe('throws an error, when given', () => {
    it('a string not being a member of the enum', () => {
      expect(() => {
        parseEnum('Three', SampleEnum);
      }).toThrow();
    });
  });
});

