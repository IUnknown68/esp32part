import 'jest-extended';

import {
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import {
  parseEnum,
  parseType,
  parseSubtypeApp,
  parseSubtypeData,
  parseFlag,
  parseNumber,
  csvRowToPartition,
  csvToPartitionList,
} from './csv';

enum SampleEnum {
  Zero = 0x00,
  One = 0x01,
  Two = 0x02,
}

describe('parseEnum', () => {
  describe('returns a number, when given', () => {
    it('a number not being a member of the enum', () => {
      expect(parseEnum('123', SampleEnum)).toBe(123);
    });
    it('a number being a member of the enum', () => {
      expect(parseEnum('1', SampleEnum)).toBe(SampleEnum.One);
    });
    it('a string being a member of the enum', () => {
      expect(parseEnum('One', SampleEnum)).toBe(SampleEnum.One);
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

describe('parseType', () => {
  it('returns a PartitionType', () => {
    expect(parseType('data')).toBe(PartitionType.data);
  });
});

describe('parseSubtypeApp', () => {
  it('returns a PartitionSubTypeApp', () => {
    expect(parseSubtypeApp('ota_3')).toBe(PartitionSubTypeApp.ota_3);
  });
});

describe('parseSubtypeData', () => {
  it('returns a PartitionSubTypeData', () => {
    expect(parseSubtypeData('efuse_em')).toBe(PartitionSubTypeData.efuse_em);
  });
});

describe('parseFlag', () => {
  it('returns a PartitionSubTypeData', () => {
    expect(parseFlag('encrypted')).toBe(PartitionFlags.encrypted);
  });
});

describe('parseNumber', () => {
  describe('returns a number, when given', () => {
    it('a number string', () => {
      expect(parseNumber('123')).toBe(123);
    });
    it('a padded number string', () => {
      expect(parseNumber(' 123 ')).toBe(123);
    });

    it('a number string with suffix "K"', () => {
      expect(parseNumber('123K')).toBe(123 * 1024);
    });
    it('a number string with suffix "M"', () => {
      expect(parseNumber('123M')).toBe(123 * 1024 * 1024);
    });
    it('a padded number string with suffix "K"', () => {
      expect(parseNumber(' 123K ')).toBe(123 * 1024);
    });

    it('a hex string', () => {
      expect(parseNumber('0x5c')).toBe(0x5c);
    });
    it('a padded hex string', () => {
      expect(parseNumber('  0x5c  ')).toBe(0x5c);
    });

    it('a hex string with suffix "K"', () => {
      expect(parseNumber('0x5cK')).toBe(0x5c * 1024);
    });
    it('a hex string with suffix "M"', () => {
      expect(parseNumber('0x5cM')).toBe(0x5c * 1024 * 1024);
    });
    it('a padded hex string with suffix "K"', () => {
      expect(parseNumber(' 0x5cK ')).toBe(0x5c * 1024);
    });
  });

  describe('throws an error, when given', () => {
    it('an empty string', () => {
      expect(() => {
        parseNumber('');
      }).toThrow();
    });
    it('an unparsable string', () => {
      expect(() => {
        parseNumber('abz');
      }).toThrow();
    });
    it('an unknown suffix', () => {
      expect(() => {
        parseNumber('123G');
      }).toThrow();
    });
  });
});

describe('csvRowToPartition', () => {
  describe('returns null, when', () => {
    it('a row starts with "#"', () => {
      expect(csvRowToPartition('# test')).toBeNull();
    });
    it('a row starts with spaces and "#"', () => {
      expect(csvRowToPartition(' # test')).toBeNull();
    });
    it('a row is empty', () => {
      expect(csvRowToPartition(' ')).toBeNull();
    });
  });

  describe('throws an error, when', () => {
    it('a row has too little columns', () => {
      expect(() => {
        csvRowToPartition('foo');
      }).toThrow();
    });
  });

  describe('returns a PartitionRecord, when', () => {
    it('the row contains all valid data', () => {
      const VALID_ROW = 'nvs,      data, nvs,     0x9000,  0x5000, encrypted:readonly';
      const VALID_ROW_RESULT = [
        ['name', 'nvs'],
        ['type', PartitionType.data],
        ['subType', PartitionSubTypeData.nvs],
        ['offset', 0x9000],
        ['size', 0x5000],
        ['flags', [1, 2]],
      ];

      const result = csvRowToPartition(VALID_ROW);
      expect(result).toContainAllEntries(VALID_ROW_RESULT);
    });
    it('the row contains valid data, but no flags', () => {
      const VALID_ROW_WO_FLAGS = 'nvs,      data, nvs,     0x9000,  0x5000, ';
      const VALID_ROW_RESULT_WO_FLAGS = [
        ['name', 'nvs'],
        ['type', PartitionType.data],
        ['subType', PartitionSubTypeData.nvs],
        ['offset', 0x9000],
        ['size', 0x5000],
        ['flags', []],
      ];

      const result = csvRowToPartition(VALID_ROW_WO_FLAGS);
      expect(result).toContainAllEntries(VALID_ROW_RESULT_WO_FLAGS);
    });
    it('the row contains valid data, but no offset', () => {
      const VALID_ROW_WO_FLAGS = 'nvs,      data, nvs, ,  0x5000, ';
      const VALID_ROW_RESULT_WO_FLAGS = [
        ['name', 'nvs'],
        ['type', PartitionType.data],
        ['subType', PartitionSubTypeData.nvs],
        ['offset', 0],
        ['size', 0x5000],
        ['flags', []],
      ];

      const result = csvRowToPartition(VALID_ROW_WO_FLAGS);
      expect(result).toContainAllEntries(VALID_ROW_RESULT_WO_FLAGS);
    });
  });
});

describe('csvToPartitionList', () => {
  const CSV = [
    '# Name,   Type, SubType, Offset,  Size, Flags',
    'nvs,      data, nvs,     0x9000,  0x5000,',
    'otadata,  data, ota,     0xe000,  0x2000,encrypted',
    'app0,     app,  ota_0,   0x10000, 0x140000,encrypted:readonly',
    'app1,     app,  ota_1,   0x150000,0x140000,readonly',
    'spiffs,   data, spiffs,  0x290000,0x160000,',
    'coredump, data, coredump,0x3F0000,0x10000,',
  ];

  describe('parses all rows, when', () => {
    it('rows are separated by \\n', () => {
      const result = csvToPartitionList(CSV.join('\n'));
      expect(result).toBeArrayOfSize(6);
    });
    it('rows are separated by \\r\\n', () => {
      const result = csvToPartitionList(CSV.join('\r\n'));
      expect(result).toBeArrayOfSize(6);
    });
  });
});
