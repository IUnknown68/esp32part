const MIN_FLASHSIZE_MB = 2;
const MAX_FLASHSIZE_MB = 32;
const MAX_NAME_LEN = 15;
const MAX_PARTITION_TABLE_LENGTH = 0xC00;
// export const MD5_PARTITION_BEGIN = b'\xEB\xEB' + b'\xFF' * 14
const MIN_PARTITION_SIZE = 0x1000;
const BLOCK_ALIGNMENT_DATA = 0x1000;
const BLOCK_ALIGNMENT_APP = 0x10000;
var PartitionSize;
(function (PartitionSize) {
    PartitionSize[PartitionSize["S1Mb"] = 1048576] = "S1Mb";
    PartitionSize[PartitionSize["S2Mb"] = 2097152] = "S2Mb";
    PartitionSize[PartitionSize["S4Mb"] = 4194304] = "S4Mb";
    PartitionSize[PartitionSize["S8Mb"] = 8388608] = "S8Mb";
    PartitionSize[PartitionSize["S16Mb"] = 16777216] = "S16Mb";
    PartitionSize[PartitionSize["S32Mb"] = 33554432] = "S32Mb";
    PartitionSize[PartitionSize["S64Mb"] = 67108864] = "S64Mb";
    PartitionSize[PartitionSize["S128Mb"] = 134217728] = "S128Mb";
})(PartitionSize || (PartitionSize = {}));
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

class PartitionTable {
    static fromCsv(csv, maxSize = PartitionSize.S128Mb) {
        const table = new PartitionTable(maxSize);
        return table;
    }
    constructor(maxSize = PartitionSize.S128Mb) {
        this.maxSize = maxSize;
    }
}

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
    const data = line.split(/\s*,\s*/);
    if (data.length === 1 && !data[0].trim()) {
        // empty line, just ignore
        return null;
    }
    if (data.length !== EXPECTED_COLUMNS) {
        throw new Error(`Invalid csv row: Expected ${EXPECTED_COLUMNS} columns.`);
    }
    const type = parseType(data[1]);
    const subType = (type === PartitionType.app)
        ? parseSubtypeApp(data[2])
        : parseSubtypeData(data[2]);
    const flagStr = data[5].trim();
    const flags = flagStr
        ? flagStr.split(/:/).map(parseFlag)
        : [];
    return {
        name: data[0],
        type,
        subType,
        offset: parseNumber(data[3]),
        size: parseNumber(data[4]),
        flags,
    };
}
//------------------------------------------------------------------------------
function csvToPartitionList(value) {
    return value.split(/\r?\n/)
        .map(csvRowToPartition)
        .filter((line) => !!line);
}

export { BLOCK_ALIGNMENT_APP, BLOCK_ALIGNMENT_DATA, MAX_FLASHSIZE_MB, MAX_NAME_LEN, MAX_PARTITION_TABLE_LENGTH, MIN_FLASHSIZE_MB, MIN_PARTITION_SIZE, PartitionFlags, PartitionSize, PartitionSubTypeApp, PartitionSubTypeData, PartitionTable, PartitionType, csvRowToPartition, csvToPartitionList, parseEnum, parseFlag, parseNumber, parseSubtypeApp, parseSubtypeData, parseType };
//# sourceMappingURL=esp32part.mjs.map
