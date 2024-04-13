import 'jest-extended';

import {
  PartitionType,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import {
  clonePartitionRecord,
} from './PartitionRecord';

import {
  SAMPLE_PARTITION_RECORD,
} from './testdata';

describe('clonePartitionRecord', () => {
  describe('returns an Object, that ', () => {
    it('has all properties of the source', () => {
      const result = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      expect(result).toContainAllEntries([
        ['name', 'nvs'],
        ['type', PartitionType.data],
        ['subType', PartitionSubTypeData.nvs],
        ['offset', 0x9000],
        ['size', 0x5000],
        ['flags', [PartitionFlags.encrypted]],
        ['lock', false],
      ]);
    });

    it('is not identical to the source', () => {
      const result = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      expect(result).not.toBe(SAMPLE_PARTITION_RECORD);
      expect(result.flags).not.toBe(SAMPLE_PARTITION_RECORD.flags);
    });
  });
});
