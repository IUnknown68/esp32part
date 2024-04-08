import 'jest-extended';

import {
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
} from './constants';

import {
  isValidType,
  isValidSubType,
} from './validation';

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
