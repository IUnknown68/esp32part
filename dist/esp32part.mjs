const MIN_FLASHSIZE_MIB = 2;
const MAX_FLASHSIZE_MIB = 32;
const MAX_NAME_LEN = 15;
const OFFSET_PART_TABLE = 0x8000;
const MAX_PARTITION_TABLE_LENGTH = 0xC00;
const DEFAULT_PARTITION_SIZE = 0x1000;
const PARTITION_TABLE_SIZE = 0x1000;
// export const MD5_PARTITION_BEGIN = b'\xEB\xEB' + b'\xFF' * 14
const BLOCK_ALIGNMENT_DATA = 0x1000;
const BLOCK_ALIGNMENT_APP = 0x10000;
var FlashSize;
(function (FlashSize) {
    FlashSize[FlashSize["MiB1"] = 1048576] = "MiB1";
    FlashSize[FlashSize["MiB2"] = 2097152] = "MiB2";
    FlashSize[FlashSize["MiB4"] = 4194304] = "MiB4";
    FlashSize[FlashSize["MiB8"] = 8388608] = "MiB8";
    FlashSize[FlashSize["MiB16"] = 16777216] = "MiB16";
    FlashSize[FlashSize["MiB32"] = 33554432] = "MiB32";
    FlashSize[FlashSize["MiB64"] = 67108864] = "MiB64";
    FlashSize[FlashSize["MiB128"] = 134217728] = "MiB128";
})(FlashSize || (FlashSize = {}));
var PartitionType;
(function (PartitionType) {
    PartitionType[PartitionType["app"] = 0] = "app";
    PartitionType[PartitionType["data"] = 1] = "data";
})(PartitionType || (PartitionType = {}));
var PartitionSubTypeApp;
(function (PartitionSubTypeApp) {
    PartitionSubTypeApp[PartitionSubTypeApp["factory"] = 0] = "factory";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_0"] = 16] = "ota_0";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_1"] = 17] = "ota_1";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_2"] = 18] = "ota_2";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_3"] = 19] = "ota_3";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_4"] = 20] = "ota_4";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_5"] = 21] = "ota_5";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_6"] = 22] = "ota_6";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_7"] = 23] = "ota_7";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_8"] = 24] = "ota_8";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_9"] = 25] = "ota_9";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_10"] = 26] = "ota_10";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_11"] = 27] = "ota_11";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_12"] = 28] = "ota_12";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_13"] = 29] = "ota_13";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_14"] = 30] = "ota_14";
    PartitionSubTypeApp[PartitionSubTypeApp["ota_15"] = 31] = "ota_15";
    PartitionSubTypeApp[PartitionSubTypeApp["test"] = 32] = "test";
})(PartitionSubTypeApp || (PartitionSubTypeApp = {}));
var PartitionSubTypeData;
(function (PartitionSubTypeData) {
    PartitionSubTypeData[PartitionSubTypeData["ota"] = 0] = "ota";
    PartitionSubTypeData[PartitionSubTypeData["phy"] = 1] = "phy";
    PartitionSubTypeData[PartitionSubTypeData["nvs"] = 2] = "nvs";
    PartitionSubTypeData[PartitionSubTypeData["coredump"] = 3] = "coredump";
    PartitionSubTypeData[PartitionSubTypeData["nvs_keys"] = 4] = "nvs_keys";
    PartitionSubTypeData[PartitionSubTypeData["efuse_em"] = 5] = "efuse_em";
    PartitionSubTypeData[PartitionSubTypeData["undefined"] = 6] = "undefined";
    PartitionSubTypeData[PartitionSubTypeData["esphttpd"] = 128] = "esphttpd";
    PartitionSubTypeData[PartitionSubTypeData["fat"] = 129] = "fat";
    PartitionSubTypeData[PartitionSubTypeData["spiffs"] = 130] = "spiffs";
    PartitionSubTypeData[PartitionSubTypeData["littlefs"] = 131] = "littlefs";
})(PartitionSubTypeData || (PartitionSubTypeData = {}));
var PartitionFlags;
(function (PartitionFlags) {
    PartitionFlags[PartitionFlags["encrypted"] = 1] = "encrypted";
    PartitionFlags[PartitionFlags["readonly"] = 2] = "readonly";
})(PartitionFlags || (PartitionFlags = {}));

const EXPECTED_COLUMNS = 6;
const NUMBER_REGEX = /(0x)?([a-f0-9]+)([a-z]?)/i;
//------------------------------------------------------------------------------
function parseEnum(value, enumType) {
    try {
        return parseNumber(value.toString());
    }
    catch (err) {
        const index = Object.keys(enumType).indexOf(value);
        if (!(index >= 0)) {
            throw new TypeError(`Invalid enumerable: ${value}.`);
        }
        return Object.values(enumType)[index];
    }
}
//------------------------------------------------------------------------------
function parseType(value) {
    return parseEnum(value, PartitionType);
}
//------------------------------------------------------------------------------
function parseSubtypeApp(value) {
    return parseEnum(value, PartitionSubTypeApp);
}
//------------------------------------------------------------------------------
function parseSubtypeData(value) {
    return parseEnum(value, PartitionSubTypeData);
}
//------------------------------------------------------------------------------
function parseFlag(value) {
    return parseEnum(value, PartitionFlags);
}
//------------------------------------------------------------------------------
function parseNumber(value) {
    const m = NUMBER_REGEX.exec(value);
    if (!m) {
        throw new TypeError('Not a parsable number.');
    }
    // istanbul ignore next
    const [, prefix, matchedValue, suffix = ''] = m;
    const num = parseInt(matchedValue, prefix ? 16 : 10);
    if (Number.isNaN(num)) {
        throw new TypeError('Parse number failed.');
    }
    switch (suffix.toLowerCase()) {
        case 'm':
            return num * 1024 * 1024;
        case 'k':
            return num * 1024;
        case '':
            return num;
        default:
            throw new TypeError('Parse number: Invalid suffix.');
    }
}
//------------------------------------------------------------------------------
function csvRowToPartition(line) {
    const trimmed = line.trim();
    if (trimmed[0] === '#') {
        return null;
    }
    const data = line
        .split(/\s*,\s*/)
        .map((value) => value.trim());
    if (data.length === 1 && !data[0]) {
        // empty line, just ignore
        return null;
    }
    if (data.length !== EXPECTED_COLUMNS) {
        throw new Error(`Invalid csv row: Expected ${EXPECTED_COLUMNS} columns.`);
    }
    const size = parseNumber(data[4]);
    if (!size) {
        throw new RangeError('Size must not be 0.');
    }
    const type = parseType(data[1]);
    const subType = (type === PartitionType.app)
        ? parseSubtypeApp(data[2])
        : parseSubtypeData(data[2]);
    const flags = data[5]
        ? data[5].split(/:/).map(parseFlag)
        : [];
    return {
        name: data[0],
        type,
        subType,
        // offset can be 0, PartitionTable will set it.
        offset: data[3] ? parseNumber(data[3]) : 0,
        size,
        flags,
        autoOffset: true,
    };
}
//------------------------------------------------------------------------------
function csvToPartitionList(value) {
    return value.split(/\r?\n/)
        .map(csvRowToPartition)
        .filter((line) => !!line);
}

const { MiB128 } = FlashSize;
class PartitionTable {
    static fromCsv(csv, maxSize = MiB128) {
        return new PartitionTable(csvToPartitionList(csv), maxSize);
    }
    static getOffsetAlignment(type) {
        return (type === PartitionType.app)
            ? BLOCK_ALIGNMENT_DATA
            : BLOCK_ALIGNMENT_APP;
    }
    constructor(partitionRecords = [], maxSize = MiB128) {
        this.maxSize = maxSize;
        this.table = [];
        for (const record of partitionRecords) {
            this.addPartition(record);
        }
    }
    addPartition(record, index = -1) {
        // TODO: Check for existing partition
        const newTable = (index > -1)
            ? [
                ...this.table.slice(0, index),
                record,
                ...this.table.slice(index),
            ]
            : [
                ...this.table,
                record,
            ];
        this.validatePartitionTable(newTable);
        this.table = newTable;
    }
    validatePartitionTable(table, offsetPartitionTable = OFFSET_PART_TABLE) {
        let tableEnd = offsetPartitionTable + PARTITION_TABLE_SIZE;
        for (const [index, record] of table.entries()) {
            if (!record.autoOffset && record.offset < tableEnd) {
                throw new RangeError(`Partition ${index} overlaps.`);
            }
            if (record.autoOffset) {
                const padTo = PartitionTable.getOffsetAlignment(record.type);
                const rest = tableEnd % padTo;
                if (rest) {
                    tableEnd += padTo - rest;
                }
                record.offset = tableEnd;
            }
            if (record.size < 0) {
                // Since negative sizes are undocumented, exclude it here for now.
                throw new RangeError('Negative sizes are not supported.');
                // record.size = -record.size - record.offset;
            }
            tableEnd = record.offset + record.size;
            if (tableEnd > this.maxSize) {
                // eslint-disable-next-line no-bitwise
                throw new RangeError(`Overall size exceeds flash size (${this.maxSize >> 20} MiB).`);
            }
        }
    }
}

export { BLOCK_ALIGNMENT_APP, BLOCK_ALIGNMENT_DATA, DEFAULT_PARTITION_SIZE, FlashSize, MAX_FLASHSIZE_MIB, MAX_NAME_LEN, MAX_PARTITION_TABLE_LENGTH, MIN_FLASHSIZE_MIB, OFFSET_PART_TABLE, PARTITION_TABLE_SIZE, PartitionFlags, PartitionSubTypeApp, PartitionSubTypeData, PartitionTable, PartitionType, csvRowToPartition, csvToPartitionList, parseEnum, parseFlag, parseNumber, parseSubtypeApp, parseSubtypeData, parseType };
//# sourceMappingURL=esp32part.mjs.map
