'use strict';

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
exports.FlashSize = void 0;
(function (FlashSize) {
    FlashSize[FlashSize["MiB1"] = 1048576] = "MiB1";
    FlashSize[FlashSize["MiB2"] = 2097152] = "MiB2";
    FlashSize[FlashSize["MiB4"] = 4194304] = "MiB4";
    FlashSize[FlashSize["MiB8"] = 8388608] = "MiB8";
    FlashSize[FlashSize["MiB16"] = 16777216] = "MiB16";
    FlashSize[FlashSize["MiB32"] = 33554432] = "MiB32";
    FlashSize[FlashSize["MiB64"] = 67108864] = "MiB64";
    FlashSize[FlashSize["MiB128"] = 134217728] = "MiB128";
})(exports.FlashSize || (exports.FlashSize = {}));
exports.PartitionType = void 0;
(function (PartitionType) {
    PartitionType[PartitionType["app"] = 0] = "app";
    PartitionType[PartitionType["data"] = 1] = "data";
})(exports.PartitionType || (exports.PartitionType = {}));
exports.PartitionSubTypeApp = void 0;
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
})(exports.PartitionSubTypeApp || (exports.PartitionSubTypeApp = {}));
exports.PartitionSubTypeData = void 0;
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
})(exports.PartitionSubTypeData || (exports.PartitionSubTypeData = {}));
exports.PartitionFlags = void 0;
(function (PartitionFlags) {
    PartitionFlags[PartitionFlags["encrypted"] = 1] = "encrypted";
    PartitionFlags[PartitionFlags["readonly"] = 2] = "readonly";
})(exports.PartitionFlags || (exports.PartitionFlags = {}));

const EXPECTED_COLUMNS = 6;
const NUMBER_REGEX = /(0x)?([a-f0-9]+)([a-z]?)/i;
/**
 * Typesafe parsing of a number into an enum.
 * @type {string}          T        Enum type.
 * @param  {string}        value    String value to parse.
 * @param  {Object}        enumType The enum type as an Object.
 * @return {T}                      A valid enum of type `T`.
 * @throws {TypeError}              If the value can not be parsed as `T`.
 */
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
/**
 * Enum parser for `PartitionType`
 * @param  {string}        value   String value to parse.
 * @return {PartitionType}         A valid enum of type `PartitionType`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionType`.
 */
function parseType(value) {
    return parseEnum(value, exports.PartitionType);
}
/**
 * Enum parser for `PartitionSubTypeApp`
 * @param  {string}        value   String value to parse.
 * @return {PartitionSubTypeApp}   A valid enum of type `PartitionSubTypeApp`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionSubTypeApp`.
 */
function parseSubtypeApp(value) {
    return parseEnum(value, exports.PartitionSubTypeApp);
}
/**
 * Enum parser for `PartitionSubTypeData`
 * @param  {string}        value   String value to parse.
 * @return {PartitionSubTypeData}  A valid enum of type `PartitionSubTypeData`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionSubTypeData`.
 */
function parseSubtypeData(value) {
    return parseEnum(value, exports.PartitionSubTypeData);
}
/**
 * Enum parser for `parseFlag`
 * @param  {string}        value   String value to parse.
 * @return {parseFlag}             A valid enum of type `parseFlag`.
 * @throws {TypeError}             If the value can not be parsed as `parseFlag`.
 */
function parseFlag(value) {
    return parseEnum(value, exports.PartitionFlags);
}
/**
 * Parses a number as it can appear in a partition table csv. Takes into account
 * suffixes (K, M) and the prefix `0x` for hex numbers.
 * @param  {string} value Value to parse.
 * @return {number}       Parsed number.
 * @throws {TypeError}
 */
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
/**
 * Parses a single csv-row into a `PartitionRecord`. If the line is not a partition
 * (like a comment), returns `null`.
 * @param  {string}          line CSV-String
 * @return {PartitionRecord}      Parsed record. `null` for empty lines or comments.
 * @throws {Error}
 */
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
    const subType = (type === exports.PartitionType.app)
        ? parseSubtypeApp(data[2])
        : parseSubtypeData(data[2]);
    const flags = data[5]
        ? data[5].split(/:/).map(parseFlag)
        : [];
    // offset can be 0, PartitionManager will set it.
    const offset = data[3] ? parseNumber(data[3]) : 0;
    return {
        name: data[0],
        type,
        subType,
        offset,
        size,
        flags,
        lock: false,
    };
}
/**
 * Parses a csv-file into an `Array` of `PartitionRecord`s.
 * @param  {string}          line CSV
 * @return {Array<PartitionRecord>}      Parsed records.
 * @throws {Error}
 */
function csvToPartitionList(value) {
    return value.split(/\r?\n/)
        .map(csvRowToPartition)
        .filter((line) => !!line);
}

//------------------------------------------------------------------------------
function clonePartitionRecord(record) {
    return Object.assign(Object.assign({}, record), { flags: [...record.flags] });
}

const { MiB128 } = exports.FlashSize;
//------------------------------------------------------------------------------
class PartitionManager {
    static fromCsv(csv, maxSize = MiB128) {
        return new PartitionManager(csvToPartitionList(csv), maxSize);
    }
    constructor(table = [], maxSize = MiB128) {
        this.maxSize = maxSize;
        const tableEnd = validatePartitionTable([
            ...table.map(clonePartitionRecord),
        ]);
        if (tableEnd > this.maxSize) {
            // eslint-disable-next-line no-bitwise
            throw new RangeError(`Overall size exceeds flash size (${this.maxSize >> 20} MiB).`);
        }
        this.table = table;
    }
    addPartition(record, index = -1) {
        // TODO: Check for existing partition
        const newTable = ((index > -1)
            ? [
                ...this.table.slice(0, index),
                record,
                ...this.table.slice(index),
            ]
            : [
                ...this.table,
                record,
            ]).map(clonePartitionRecord);
        const tableEnd = validatePartitionTable(newTable);
        if (tableEnd > this.maxSize) {
            // eslint-disable-next-line no-bitwise
            throw new RangeError(`Overall size exceeds flash size (${this.maxSize >> 20} MiB).`);
        }
        this.table = newTable;
    }
}
//------------------------------------------------------------------------------
function getOffsetAlignment(type) {
    return (type === exports.PartitionType.app)
        ? BLOCK_ALIGNMENT_APP
        : BLOCK_ALIGNMENT_DATA;
}
//------------------------------------------------------------------------------
function validatePartition(record, offsetMin = 0) {
    if (record.offset && record.offset < offsetMin) {
        throw new RangeError('Partition overlaps.');
    }
    if (!record.offset) {
        const padTo = getOffsetAlignment(record.type);
        const rest = offsetMin % padTo;
        // eslint-disable-next-line no-param-reassign
        record.offset = (rest)
            ? offsetMin + padTo - rest
            : offsetMin;
    }
    if (record.size <= 0) {
        // Since negative sizes are undocumented, exclude it here for now.
        throw new RangeError('Negative sizes are not supported.');
        // record.size = -record.size - record.offset;
    }
    return record.offset + record.size;
}
//------------------------------------------------------------------------------
function validatePartitionTable(table, offsetPartitionTable = OFFSET_PART_TABLE) {
    return table.reduce((tableEnd, record) => validatePartition(record, tableEnd), offsetPartitionTable + PARTITION_TABLE_SIZE);
}

exports.BLOCK_ALIGNMENT_APP = BLOCK_ALIGNMENT_APP;
exports.BLOCK_ALIGNMENT_DATA = BLOCK_ALIGNMENT_DATA;
exports.DEFAULT_PARTITION_SIZE = DEFAULT_PARTITION_SIZE;
exports.MAX_FLASHSIZE_MIB = MAX_FLASHSIZE_MIB;
exports.MAX_NAME_LEN = MAX_NAME_LEN;
exports.MAX_PARTITION_TABLE_LENGTH = MAX_PARTITION_TABLE_LENGTH;
exports.MIN_FLASHSIZE_MIB = MIN_FLASHSIZE_MIB;
exports.OFFSET_PART_TABLE = OFFSET_PART_TABLE;
exports.PARTITION_TABLE_SIZE = PARTITION_TABLE_SIZE;
exports.PartitionManager = PartitionManager;
exports.clonePartitionRecord = clonePartitionRecord;
exports.csvRowToPartition = csvRowToPartition;
exports.csvToPartitionList = csvToPartitionList;
exports.getOffsetAlignment = getOffsetAlignment;
exports.parseEnum = parseEnum;
exports.parseFlag = parseFlag;
exports.parseNumber = parseNumber;
exports.parseSubtypeApp = parseSubtypeApp;
exports.parseSubtypeData = parseSubtypeData;
exports.parseType = parseType;
exports.validatePartition = validatePartition;
exports.validatePartitionTable = validatePartitionTable;
//# sourceMappingURL=esp32part.js.map
