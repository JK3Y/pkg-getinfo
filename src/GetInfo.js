"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var PkgReader_1 = require("./PkgReader");
var PkgAesCounter_1 = require("./PkgAesCounter");
var Slicer_1 = require("./Slicer");
var fast_sha256_1 = require("fast-sha256");
var aesjs = require("aes-js");
var path = require("path");
var PBPItemEntry = /** @class */ (function () {
    function PBPItemEntry(init) {
        this.name = '';
        this.isFileOfs = -1;
        this.dataOfs = init.dataOfs;
        this.dataSize = init.dataSize;
        this.index = init.index;
        // this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize)
    }
    return PBPItemEntry;
}());
var PKG3ItemEntry = /** @class */ (function () {
    function PKG3ItemEntry(init) {
        this.name = '';
        this.isFileOfs = -1;
        this.itemNameOfs = init.itemNameOfs;
        this.itemNameSize = init.itemNameSize;
        this.dataOfs = init.dataOfs;
        this.dataSize = init.dataSize;
        this.flags = init.flags;
        this.padding1 = init.padding1;
        this.index = init.index;
        this.keyIndex = (this.flags >> 28) & 0x7;
        this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize);
    }
    return PKG3ItemEntry;
}());
var CONST_PKG3_MAGIC = 0x7f504b47;
var CONST_PKG3_HEADER_SIZE = 128;
var CONST_PKG3_HEADER_EXT_SIZE = 64;
var CONST_PKG3_DIGEST_SIZE = 64;
var CONST_PKG3_ITEM_ENTRY_SIZE = 32;
var CONST_PKG3_EXT_MAGIC = 0x7f657874;
var CONST_PKG3_CONTENT_KEYS = [
    {
        key: new Uint8Array([0x2e, 0x7b, 0x71, 0xd7, 0xc9, 0xc9, 0xa1, 0x4e, 0xa3, 0x22, 0x1f, 0x18, 0x88, 0x28, 0xb8, 0xf8]),
        // key: 'Lntx18nJoU6jIh8YiCi4+A==',
        desc: 'PS3'
    },
    {
        key: new Uint8Array([0x07, 0xf2, 0xc6, 0x82, 0x90, 0xb5, 0x0d, 0x2c, 0x33, 0x81, 0x8d, 0x70, 0x9b, 0x60, 0xe6, 0x2b]),
        // key: 'B/LGgpC1DSwzgY1wm2DmKw==',
        desc: 'PSX/PSP'
    },
    {
        key: new Uint8Array([0xe3, 0x1a, 0x70, 0xc9, 0xce, 0x1d, 0xd7, 0x2b, 0xf3, 0xc0, 0x62, 0x29, 0x63, 0xf2, 0xec, 0xcb]),
        // key: '4xpwyc4d1yvzwGIpY/Lsyw==',
        desc: 'PSV',
        derive: true
    },
    {
        key: new Uint8Array([0x42, 0x3a, 0xca, 0x3a, 0x2b, 0xd5, 0x64, 0x9f, 0x96, 0x86, 0xab, 0xad, 0x6f, 0xd8, 0x80, 0x1f]),
        // key: 'QjrKOivVZJ+Whqutb9iAHw==',
        desc: 'Unknown',
        derive: true
    },
    {
        key: new Uint8Array([0xaf, 0x07, 0xfd, 0x59, 0x65, 0x25, 0x27, 0xba, 0xf1, 0x33, 0x89, 0x66, 0x8b, 0x17, 0xd9, 0xea]),
        // key: 'rwf9WWUlJ7rxM4lmixfZ6g==',
        desc: 'PSM',
        derive: true
    },
];
var CONST_PKG3_UPDATE_KEYS = {
    2: {
        key: new Uint8Array([0xE5, 0xE2, 0x78, 0xAA, 0x1E, 0xE3, 0x40, 0x82, 0xA0, 0x88, 0x27, 0x9C, 0x83, 0xF9, 0xBB, 0xC8, 0x06, 0x82, 0x1C, 0x52, 0xF2, 0xAB, 0x5D, 0x2B, 0x4A, 0xBD, 0x99, 0x54, 0x50, 0x35, 0x51, 0x14]),
        desc: 'PSV'
    }
};
var CONST_PKG4_MAIN_HEADER_SIZE = 1440;
var CONST_PKG4_FILE_ENTRY_SIZE = 32;
var CONST_PKG4_MAGIC = 0x7f434e54;
var CONST_PKG4_FILE_ENTRY_ID_DIGEST_TABLE = 0x0001;
var CONST_PKG4_FILE_ENTRY_ID_ENTRY_KEYS = 0x0010;
var CONST_PKG4_FILE_ENTRY_ID_IMAGE_KEY = 0x0020;
var CONST_PKG4_FILE_ENTRY_ID_GENERAL_DIGESTS = 0x0080;
var CONST_PKG4_FILE_ENTRY_ID_META_TABLE = 0x0100;
var CONST_PKG4_FILE_ENTRY_ID_NAME_TABLE = 0x0200;
var CONST_PKG4_FILE_ENTRY_ID_PARAM_SFO = 0x1000;
var CONST_PKG4_FILE_ENTRY_NAME_MAP = {
    CONST_PKG4_FILE_ENTRY_ID_DIGEST_TABLE: '.digests',
    CONST_PKG4_FILE_ENTRY_ID_ENTRY_KEYS: '.entry_keys',
    CONST_PKG4_FILE_ENTRY_ID_IMAGE_KEY: '.image_key',
    CONST_PKG4_FILE_ENTRY_ID_GENERAL_DIGESTS: '.general_digests',
    CONST_PKG4_FILE_ENTRY_ID_META_TABLE: '.metatable',
    CONST_PKG4_FILE_ENTRY_ID_NAME_TABLE: '.nametable',
    0x0400: 'license.dat',
    0x0401: 'license.info',
    0x0402: 'nptitle.dat',
    0x0403: 'npbind.dat',
    0x0404: 'selfinfo.dat',
    0x0406: 'imageinfo.dat',
    0x0407: 'target-deltainfo.dat',
    0x0408: 'origin-deltainfo.dat',
    0x0409: 'psreserved.dat',
    CONST_PKG4_FILE_ENTRY_ID_PARAM_SFO: 'param.sfo',
    0x1001: 'playgo-chunk.dat',
    0x1002: 'playgo-chunk.sha',
    0x1003: 'playgo-manifest.xml',
    0x1004: 'pronunciation.xml',
    0x1005: 'pronunciation.sig',
    0x1006: 'pic1.png',
    0x1007: 'pubtoolinfo.dat',
    0x1008: 'app/playgo-chunk.dat',
    0x1009: 'app/playgo-chunk.sha',
    0x100a: 'app/playgo-manifest.xml',
    0x100b: 'shareparam.json',
    0x100c: 'shareoverlayimage.png',
    0x100d: 'save_data.png',
    0x100e: 'shareprivacyguardimage.png',
    0x1200: 'icon0.png',
    0x1220: 'pic0.png',
    0x1240: 'snd0.at9',
    0x1260: 'changeinfo/changeinfo.xml',
    0x1280: 'icon0.dds',
    0x12a0: 'pic0.dds',
    0x12c0: 'pic1.dds'
};
var CONST_PARAM_SFO_MAGIC = 0x00505346;
var CONST_SFO_HEADER_SIZE = 20;
var CONST_SFO_INDEX_ENTRY_SIZE = 16;
var CONST_PBP_HEADER_SIZE = 40;
var CONST_PBP_MAGIC = 0x00504250;
var CONST_REGEX_PBP_SUFFIX = /\.PBP$/iu;
var CONST_PSP_PSV_RIF_SIZE = 512;
var CONST_PSM_RIF_SIZE = 1024;
var CONST_DATATYPE_AS_IS = 'AS-IS';
var CONST_DATATYPE_DECRYPTED = 'DECRYPTED';
var CONST_DATATYPE_UNENCRYPTED = 'UNENCRYPTED';
var CONST_CONTENT_ID_SIZE = 0x30;
var CONST_SHA256_HASH_SIZE = 0x20;
var CONST_READ_SIZE = (function () {
    var min = Math.ceil(50);
    var max = Math.floor(100);
    return Math.floor(Math.random() * (max - min + 1)) + min;
})();
var CONST_READ_AHEAD_SIZE = 128 * 0x400;
var REPLACE_LIST = [['™®☆◆', ' '], ['—–', '-']];
var GetInfo = /** @class */ (function () {
    function GetInfo(options) {
        this.options = options;
    }
    GetInfo.prototype.pkg = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var sfoBytes, pkgHeader, pkgExtHeader, pkgMetadata, pkgSfoValues, pkgItemEntries, pkgFileTable, pkgFileTableMap, itemSfoValues, pbpHeader, pbpItemEntries, pbpSfoValues, npsType, mainSfoValues, results, pkg, _a, e_1, magic, _b, _c, _d, _e, parsedHeader, parsedItems, retrieveEncryptedParamSfo, _i, pkgItemEntries_1, itemEntry, itemIndex, sfoMagic, pbpBytes, parsedPBP, _f, e_2, parsedPbpHeader, r, _g, _h, language, key, _j, REPLACE_LIST_1, replaceChars, i, replaceChar, _k, _l, language, key, _m, REPLACE_LIST_2, replaceChars, i, replaceChar, updateHash, data, updateHash, data, sfoValues, jsonOutput;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4 /*yield*/, this.initReader(url)];
                    case 1:
                        _o.sent();
                        pkgHeader = null;
                        pkgExtHeader = null;
                        pkgMetadata = null;
                        pkgSfoValues = null;
                        pkgItemEntries = null;
                        pkgFileTable = null;
                        pkgFileTableMap = null;
                        itemSfoValues = null;
                        pbpHeader = null;
                        pbpItemEntries = null;
                        pbpSfoValues = null;
                        npsType = 'UNKNOWN';
                        mainSfoValues = null;
                        results = {};
                        pkg = {
                            headBytes: Buffer.from([]),
                            tailBytes: Buffer.from([])
                        };
                        _o.label = 2;
                    case 2:
                        _o.trys.push([2, 4, , 5]);
                        _a = pkg;
                        return [4 /*yield*/, this.reader.read(0, 4)];
                    case 3:
                        _a.headBytes = _o.sent();
                        this.reader.close();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _o.sent();
                        console.error(e_1);
                        this.reader.close();
                        throw new Error("Could not get PKG magic at offset 0 with size 4 from " + this.reader.getSource());
                    case 5:
                        magic = pkg.headBytes.toString('hex');
                        if (!(magic === CONST_PKG3_MAGIC.toString(16))) return [3 /*break*/, 25];
                        pkg.itemsInfoBytes = {};
                        pkg.itemBytes = {};
                        _b = pkg;
                        _d = (_c = Buffer).concat;
                        _e = [pkg.headBytes];
                        return [4 /*yield*/, this.reader.read(4, CONST_PKG3_HEADER_SIZE - 4)];
                    case 6:
                        _b.headBytes = _d.apply(_c, [_e.concat([
                                _o.sent()
                            ])]);
                        return [4 /*yield*/, parsePkg3Header(pkg.headBytes, this.reader)];
                    case 7:
                        parsedHeader = _o.sent();
                        pkgHeader = parsedHeader.pkgHeader;
                        pkgExtHeader = parsedHeader.pkgExtHeader;
                        pkgMetadata = parsedHeader.pkgMetadata;
                        pkg.headBytes = parsedHeader.headBytes;
                        if (pkgHeader.totalSize) {
                            results.pkgTotalSize = parseInt(pkgHeader.totalSize.toString('hex'), 16);
                        }
                        if (pkgHeader.contentId) {
                            results.pkgContentId = pkgHeader.contentId;
                            results.pkgCidTitleId1 = pkgHeader.contentId.substr(7, 16);
                            results.pkgCidTitleId2 = pkgHeader.contentId.substr(20);
                        }
                        if (pkgMetadata[0x0e]) {
                            results.pkgSfoOffset = pkgMetadata[0x0e].ofs;
                            results.pkgSfoSize = pkgMetadata[0x0e].size;
                        }
                        if (pkgMetadata[0x01]) {
                            results.pkgDrmType = pkgMetadata[0x01].value;
                        }
                        if (pkgMetadata[0x02]) {
                            results.pkgContentType = pkgMetadata[0x02].value;
                        }
                        if (pkgMetadata[0x06]) {
                            results.mdTitleId = pkgMetadata[0x06].value;
                        }
                        if (!results.pkgSfoOffset) return [3 /*break*/, 10];
                        return [4 /*yield*/, retrieveParamSfo(pkg, results, this.reader)
                            // const sfoMagic = sfoBytes.readUInt32BE(0)
                            // const sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16)
                            // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
                            //   this.reader.close()
                            //   throw new Error(`Not a known PARAM.SFO structure`)
                            // }
                        ];
                    case 8:
                        sfoBytes = _o.sent();
                        // const sfoMagic = sfoBytes.readUInt32BE(0)
                        // const sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16)
                        // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
                        //   this.reader.close()
                        //   throw new Error(`Not a known PARAM.SFO structure`)
                        // }
                        checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
                        return [4 /*yield*/, parseSfo(sfoBytes)];
                    case 9:
                        pkgSfoValues = _o.sent();
                        _o.label = 10;
                    case 10:
                        if (!(pkgHeader.keyIndex !== null)) return [3 /*break*/, 12];
                        return [4 /*yield*/, parsePkg3ItemsInfo(pkgHeader, pkgMetadata, this.reader)];
                    case 11:
                        parsedItems = _o.sent();
                        pkg.itemsInfoBytes = parsedItems.itemsInfoBytes;
                        pkgItemEntries = parsedItems.pkgItemEntries;
                        results.itemsInfo = pkg.itemsInfoBytes;
                        if (results.itemsInfo[CONST_DATATYPE_AS_IS]) {
                            delete results.itemsInfo[CONST_DATATYPE_AS_IS];
                        }
                        if (results.itemsInfo[CONST_DATATYPE_DECRYPTED]) {
                            delete results.itemsInfo[CONST_DATATYPE_DECRYPTED];
                        }
                        _o.label = 12;
                    case 12:
                        if (!pkgItemEntries) return [3 /*break*/, 20];
                        retrieveEncryptedParamSfo = false;
                        if (pkgHeader.paramSfo) {
                            retrieveEncryptedParamSfo = true;
                        }
                        _i = 0, pkgItemEntries_1 = pkgItemEntries;
                        _o.label = 13;
                    case 13:
                        if (!(_i < pkgItemEntries_1.length)) return [3 /*break*/, 20];
                        itemEntry = pkgItemEntries_1[_i];
                        if (!itemEntry.name || itemEntry.dataSize <= 0) {
                            return [3 /*break*/, 19];
                        }
                        itemIndex = itemEntry.index;
                        if (!(retrieveEncryptedParamSfo && itemEntry.name === pkgHeader.paramSfo)) return [3 /*break*/, 15];
                        // Retrieve PARAM.SFO
                        pkg.itemBytes[itemIndex] = {};
                        pkg.itemBytes[itemIndex].add = true;
                        return [4 /*yield*/, processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex])
                            // Process PARAM.SFO
                        ];
                    case 14:
                        _o.sent();
                        // Process PARAM.SFO
                        sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta, itemEntry.align.ofsDelta + itemEntry.dataSize);
                        sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16);
                        // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
                        //   this.reader.close()
                        //   throw new Error(`Not a known PARAM.SFO structure`)
                        // }
                        checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
                        // Process PARAM.SFO data
                        itemSfoValues = parseSfo(sfoBytes);
                        return [3 /*break*/, 19];
                    case 15:
                        if (!CONST_REGEX_PBP_SUFFIX.test(itemEntry.name)) return [3 /*break*/, 19];
                        // Retrieve PBP header
                        pkg.itemBytes[itemIndex] = {};
                        pkg.itemBytes[itemIndex].add = true;
                        return [4 /*yield*/, processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex], Math.min(2048, itemEntry.dataSize))
                            // Process PBP header
                        ];
                    case 16:
                        _o.sent();
                        pbpBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta, itemEntry.align.ofsDelta + CONST_PBP_HEADER_SIZE);
                        return [4 /*yield*/, parsePbpHeader(pbpBytes, itemEntry.dataSize)];
                    case 17:
                        parsedPBP = _o.sent();
                        pbpHeader = parsedPBP.pbpHeaderFields;
                        pbpItemEntries = parsedPBP.itemEntries;
                        return [4 /*yield*/, processPkg3Item(pkgHeader, itemEntry, this.reader, pkg.itemBytes[itemIndex], pbpHeader.iconPngOfs)
                            // Process PARAM.SFO
                        ];
                    case 18:
                        _o.sent();
                        // Process PARAM.SFO
                        sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(itemEntry.align.ofsDelta + pbpItemEntries[0].dataOfs, itemEntry.align.ofsDelta +
                            pbpItemEntries[0].dataOfs +
                            pbpItemEntries[0].dataSize);
                        // Check for known PARAM.SFO data
                        checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
                        // Process PARAM.SFO data
                        pbpSfoValues = parseSfo(sfoBytes);
                        _o.label = 19;
                    case 19:
                        _i++;
                        return [3 /*break*/, 13];
                    case 20:
                        if (pkgSfoValues === null && itemSfoValues !== null) {
                            pkgSfoValues = itemSfoValues;
                            itemSfoValues = null;
                        }
                        mainSfoValues = pkgSfoValues;
                        _o.label = 21;
                    case 21:
                        _o.trys.push([21, 23, , 24]);
                        _f = pkg;
                        return [4 /*yield*/, this.reader.read(pkgHeader.dataOffset + pkgHeader.dataSize, pkgHeader.totalSize - (pkgHeader.dataOffset + pkgHeader.dataSize))];
                    case 22:
                        _f.tailBytes = _o.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        e_2 = _o.sent();
                        this.reader.close();
                        console.error("Could not get PKG3 unencrypted tail at offset " + (pkgHeader.dataOffset +
                            pkgHeader.dataSize) + " size " + (pkgHeader.totalSize -
                            (pkgHeader.dataOffset +
                                pkgHeader.dataSize)) + " from " + this.reader.getSource());
                        return [3 /*break*/, 24];
                    case 24:
                        if (pkg.tailBytes) {
                            // may not be present or have failed, e.g. when analyzing a head.bin file, a broken download or only thje first file of a multi-part package
                            results.pkgTailSize = pkg.tailBytes.length;
                            results.pkgTailSha1 = pkg.tailBytes.slice(-0x20, -0x0c);
                        }
                        return [3 /*break*/, 31];
                    case 25:
                        if (!(magic === CONST_PKG4_MAGIC.toString(16))) return [3 /*break*/, 26];
                        // PS4
                        console.error('PS4 support not yet added.');
                        return [3 /*break*/, 31];
                    case 26:
                        if (!(magic === CONST_PBP_MAGIC.toString(16))) return [3 /*break*/, 31];
                        return [4 /*yield*/, parsePbpHeader(pkg.headBytes, results.fileSize, this.reader)];
                    case 27:
                        parsedPbpHeader = _o.sent();
                        pbpHeader = parsedPbpHeader.pbpHeaderFields;
                        pbpItemEntries = parsedPbpHeader.itemEntries;
                        if (!(pbpItemEntries.length >= 1 && pbpItemEntries[0].dataSize > 0)) return [3 /*break*/, 31];
                        results.pkgSfoOffset = pbpItemEntries[0].dataOfs;
                        results.pkgSfoSize = pbpItemEntries[0].dataSize;
                        return [4 /*yield*/, retrieveParamSfo(pkg, results, this.reader)
                            // Process PARAM.SFO if present
                        ];
                    case 28:
                        // Retrieve PBP PARAM.SFO from unencrypted data
                        sfoBytes = _o.sent();
                        if (!sfoBytes) return [3 /*break*/, 30];
                        // Check for known PARAM.SFO data
                        checkSfoMagic(sfoBytes.slice(0, 4), this.reader);
                        return [4 /*yield*/, parseSfo(sfoBytes)];
                    case 29:
                        // Process PARAM.SFO data
                        pbpSfoValues = _o.sent();
                        _o.label = 30;
                    case 30:
                        mainSfoValues = pbpSfoValues;
                        _o.label = 31;
                    case 31:
                        if (results.pkgContentId) {
                            results.contentId = results.pkgContentId;
                            results.cidTitleId1 = results.contentId.substring(7, 16);
                            results.cidTitleId2 = results.contentId.substring(20);
                            results.titleId = results.cidTitleId1;
                        }
                        if (results.mdTitleId) {
                            if (!results.titleId) {
                                results.titleId = results.mdTitleId;
                            }
                            if (results.cidTitleId1 && results.mdTitleId !== results.cidTitleId1) {
                                results.mdTidDiffer = true;
                            }
                        }
                        // Process main PARAM.SFO if present
                        if (mainSfoValues) {
                            if (mainSfoValues.DISK_ID) {
                                results.sfoTitleId = mainSfoValues.DISK_ID;
                            }
                            if (mainSfoValues.TITLE_ID) {
                                results.sfoTitleId = mainSfoValues.TITLE_ID;
                                if (results.pkgCidTitleId1 &&
                                    mainSfoValues.TITLE_ID !== results.pkgCidTitleId1) {
                                    results.sfoPkgTidDiffer = true;
                                }
                            }
                            if (mainSfoValues.CONTENT_ID) {
                                results.sfoContentId = mainSfoValues.CONTENT_ID;
                                results.sfoCidTitleId1 = results.sfoContentId.substring(7, 16);
                                results.sfoCidTitleId2 = results.sfoContentId.substring(20);
                                if (results.pkgContentId &&
                                    mainSfoValues.CONTENT_ID !== results.pkgContentId) {
                                    results.sfoCidDiffer = true;
                                }
                                if (mainSfoValues.TITLE_ID &&
                                    mainSfoValues.TITLE_ID !== results.sfoCidTitleId1) {
                                    results.sfoTidDiffer = true;
                                }
                            }
                            if (mainSfoValues.CATEGORY) {
                                results.sfoCategory = mainSfoValues.CATEGORY;
                            }
                            if (mainSfoValues.PUBTOOLINFO) {
                                try {
                                    results.sfoCreationDate = mainSfoValues.PUBTOOLINFO.substring(7, 15);
                                    results.sfoSdkVer =
                                        Number(mainSfoValues.PUBTOOLINFO.substring(24, 32)) / 1000000;
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                            if (!results.titleId && results.sfoTitleId) {
                                results.titleId = results.sfoTitleId;
                            }
                            if (!results.contentId && results.sfoContentId) {
                                results.contentId = results.sfoContentId;
                                results.cidTitleId1 = results.contentId.substring(7, 16);
                                results.cidTitleId2 = results.contentId.substring(20);
                                if (!results.titleId) {
                                    results.titleId = results.cidTitleId1;
                                }
                            }
                        }
                        // Determine some derived variables
                        // a) Region and related languages
                        if (results.contentId) {
                            r = getRegion(results.contentId[0]);
                            results.region = r.region;
                            results.languages = r.languages;
                            // if (results.languages === null) {
                            // TODO: line 2831/2832
                            // }
                        }
                        // b) International/English title
                        for (_g = 0, _h = ['01', '18']; _g < _h.length; _g++) {
                            language = _h[_g];
                            key = 'TITLE_'.concat(language);
                            if (mainSfoValues && mainSfoValues[key]) {
                                results.sfoTitle = mainSfoValues[key];
                            }
                        }
                        if (!results.sfoTitle && mainSfoValues && mainSfoValues.TITLE) {
                            results.sfoTitle = mainSfoValues.TITLE;
                        }
                        // Clean international/english title
                        if (results.sfoTitle) {
                            if (REPLACE_LIST) {
                                for (_j = 0, REPLACE_LIST_1 = REPLACE_LIST; _j < REPLACE_LIST_1.length; _j++) {
                                    replaceChars = REPLACE_LIST_1[_j];
                                    for (i = 0; i < replaceChars[0].length; i++) {
                                        replaceChar = replaceChars[0][i];
                                        if (replaceChars[1] === ' ') {
                                            results.sfoTitle = results.sfoTitle.replace(replaceChar.concat(':'), ':');
                                        }
                                        results.sfoTitle = results.sfoTitle.replace(replaceChar, replaceChars[1]);
                                    }
                                }
                            }
                            results.sfoTitle = results.sfoTitle.replace(/\s+/u, ' '); // also replaces \u3000
                            // Condense demo information in title to '(DEMO)'
                            results.sfoTitle = results.sfoTitle
                                .replace('demo ver.', '(DEMO)')
                                .replace('(Demo Version)', '(DEMO)')
                                .replace('Demo Version', '(DEMO)')
                                .replace('Demo version', '(DEMO)')
                                .replace('DEMO Version', '(DEMO)')
                                .replace('DEMO version', '(DEMO)')
                                .replace('【体験版】', '(DEMO)')
                                .replace('(体験版)', '(DEMO)')
                                .replace('体験版', '(DEMO)');
                            results.sfoTitle = results.sfoTitle.replace(/(demo)/ui, '(DEMO)');
                            results.sfoTitle = results.sfoTitle.replace(/(^|[^a-z(]{1})demo([^a-z)]{1}|$)/iu, '$1(DEMO)$2');
                            results.sfoTitle = results.sfoTitle.replace(/(  )/iu, ' ');
                        }
                        // c) Regional title
                        if (results.languages) {
                            for (_k = 0, _l = results.languages; _k < _l.length; _k++) {
                                language = _l[_k];
                                key = 'TITLE_'.concat(language);
                                if (mainSfoValues && mainSfoValues[key]) {
                                    results.sfoTitleRegional = mainSfoValues[key];
                                    break;
                                }
                            }
                        }
                        if (!results.sfoTitleRegional && mainSfoValues && mainSfoValues.title) {
                            results.sfoTitleRegional = mainSfoValues.title;
                        }
                        // Clean regional title
                        if (results.sfoTitleRegional) {
                            if (REPLACE_LIST) {
                                for (_m = 0, REPLACE_LIST_2 = REPLACE_LIST; _m < REPLACE_LIST_2.length; _m++) {
                                    replaceChars = REPLACE_LIST_2[_m];
                                    for (i = 0; i < replaceChars[0].length; i++) {
                                        replaceChar = replaceChars[0][i];
                                        if (replaceChars[1] === ' ') {
                                            results.sfoTitleRegional = results.sfoTitleRegional.replace(replaceChar.concat(':'), ':');
                                        }
                                        results.sfoTitleRegional = results.sfoTitleRegional.replace(replaceChar, replaceChars[1]);
                                    }
                                }
                            }
                            results.sfoTitleRegional = results.sfoTitleRegional.replace(/\s+/u, ' '); // also replaces \u3000
                        }
                        // d) Determine platform and package type
                        // TODO: Further complete determination (e.g. PS4 content types)
                        if (magic === CONST_PKG3_MAGIC.toString(16)) {
                            if (results.pkgContentType) {
                                // PS3 packages
                                if (results.pkgContentType === 0x4 || results.pkgContentType === 0xB) {
                                    results.platform = "PS3" /* PS3 */;
                                    if (pkgMetadata[0x0B]) {
                                        results.pkgType = "Update" /* PATCH */;
                                        npsType = 'PS3 UPDATE';
                                    }
                                    else {
                                        results.pkgType = "DLC" /* DLC */;
                                        npsType = 'PS3 DLC';
                                    }
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    if (results.titleId) {
                                        results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                                    }
                                }
                                else if (results.pkgContentType === 0x5 || results.pkgContentType === 0x13 || results.pkgContentType === 0x14) {
                                    results.platform = "PS3" /* PS3 */;
                                    results.pkgType = "Game" /* GAME */;
                                    if (results.pkgContentType === 0x14) {
                                        results.pkgSubType = "PSP Remaster" /* PSP_REMASTER */;
                                    }
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PS3 GAME';
                                    if (results.titleId) {
                                        results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                                    }
                                }
                                else if (results.pkgContentType === 0x9) { // PS3/PSP Themes
                                    results.platform = "PS3" /* PS3 */;
                                    results.pkgType = "Theme" /* THEME */;
                                    npsType = 'PS3 THEME';
                                    if (pkgMetadata[0x03] && buf2Int(pkgMetadata[0x03].value) === 0x0000020C) {
                                        results.platform = "PSP" /* PSP */;
                                        npsType = 'PSP THEME';
                                    }
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                }
                                else if (results.pkgContentType === 0xD) {
                                    results.platform = "PS3" /* PS3 */;
                                    results.pkgType = "Avatar" /* AVATAR */;
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PS3 AVATAR';
                                }
                                else if (results.pkgContentType === 0x12) { // PS2/SFO_CATEGORY = 2P
                                    results.platform = "PS3" /* PS3 */;
                                    results.pkgType = "Game" /* GAME */;
                                    results.pkgSubType = "PS2 Classic" /* PS2 */;
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PS3 GAME';
                                    if (results.sfoTitleId) {
                                        results.Ps2TitleId = results.sfoTitleId;
                                    }
                                }
                                else if (results.pkgContentType === 0x1 || results.pkgContentType === 0x6) { // PSX packages
                                    results.platform = "PSX" /* PSX */;
                                    results.pkgType = "Game" /* GAME */;
                                    results.pkgExtractRootUx0 = path.join('pspemu', 'PSP', 'GAME', results.pkgCidTitleId1);
                                    results.pkgExtractLicUx0 = path.join('pspemu', 'PSP', 'LICENSE', ''.concat(results.pkgContentId, '.rif'));
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PSX GAME';
                                    // Special Case: PCSC80018 "Pocketstation for PS Vita"
                                    if (results.titleId === 'PCSC80018') {
                                        results.platform = "PSV" /* PSV */;
                                        results.pkgSubType = "PSX" /* PSX */;
                                        results.pkgExtractRootUx0 = path.join('ps1emu', results.pkgCidTitleId1);
                                        npsType = 'PSV GAME';
                                    }
                                    if (results.pkgContentType === 0x6 && results.mdTitleId) {
                                        results.psxTitleId = results.mdTitleId;
                                    }
                                }
                                else if (results.pkgContentType === 0x7 || results.pkgContentType === 0xE || results.pkgContentType === 0xF || results.pkgContentType === 0x10) {
                                    results.platform = "PSP" /* PSP */;
                                    if (pbpSfoValues && pbpSfoValues.category) {
                                        if (pbpSfoValues.category === 'PG') {
                                            results.pkgType = "Update" /* PATCH */;
                                            npsType = 'PSP UPDATE';
                                        }
                                        else if (pbpSfoValues.category === 'MG') {
                                            results.pkgType = "DLC" /* DLC */;
                                            npsType = 'PSP DLC';
                                        }
                                    }
                                    if (!results.pkgType) { // Normally CATEGORY === EG
                                        results.pkgType = "Game" /* GAME */;
                                        npsType = 'PSP GAME';
                                    }
                                    // TODO: Verify when ISO and when GAME directory has to be used?
                                    results.pkgExtractRootUx0 = path.join('pspemu', 'PSP', 'GAME', results.pkgCidTitleId1);
                                    results.pkgExtractIsorUx0 = path.join('pspemu', 'ISO');
                                    results.pkgExtractIsoName = results.sfoTitle + " [" + results.pkgCidTitleId1 + "].iso";
                                    // results.pkgExtractIsoName = ''.concat(results.sfoTitle, ' [', results.pkgCidTitleId1, ']', '.iso')
                                    if (results.pkgContentType === 0x7) {
                                        if (results.sfoCategory === 'HG') {
                                            results.pkgSubType = "PC Engine" /* PSP_PC_ENGINE */;
                                        }
                                    }
                                    else if (results.pkgContentType === 0xE) {
                                        results.pkgSubType = "Go" /* PSP_GO */;
                                    }
                                    else if (results.pkgContentType === 0xF) {
                                        results.pkgSubType = "PSP Mini" /* PSP_MINI */;
                                    }
                                    else if (results.pkgContentType === 0x10) {
                                        results.pkgSubType = "PSP NeoGeo" /* PSP_NEOGEO */;
                                    }
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    if (results.titleId) {
                                        results.titleUpdateUrl = "https://a0.ww.np.dl.playstation.net/tpl/np/" + results.titleId + "/" + results.titleId + "-ver.xml";
                                    }
                                }
                                else if (results.pkgContentType === 0x15) { // PSV packages
                                    results.platform = "PSV" /* PSV */;
                                    if (results.sfoCategory && results.sfoCategory === 'gp') {
                                        results.pkgType = "Update" /* PATCH */;
                                        results.pkgExtractRootUx0 = path.join('patch', results.cidTitleId1);
                                        npsType = 'PSV UPDATE';
                                    }
                                    else {
                                        results.pkgType = "Game" /* GAME */;
                                        results.pkgExtractRootUx0 = path.join('app', results.cidTitleId1);
                                        npsType = 'PSV GAME';
                                    }
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    if (results.titleId) {
                                        updateHash = new fast_sha256_1.HMAC(CONST_PKG3_UPDATE_KEYS[2].key);
                                        data = new TextEncoder().encode("np_" + results.titleId);
                                        updateHash.update(data);
                                        results.titleUpdateUrl = "http://gs-sec.ww.np.dl.playstation.net/pl/np/" + results.titleId + "/" + toHexString(updateHash.digest()) + "/" + results.titleId + "-ver.xml";
                                    }
                                }
                                else if (results.pkgContentType === 0x16) {
                                    results.platform = "PSV" /* PSV */;
                                    results.pkgType = "DLC" /* DLC */;
                                    results.pkgExtractRootUx0 = path.join('addcont', results.cidTitleId1, results.cidTitleId2);
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PSV DLC';
                                    if (results.titleId) {
                                        updateHash = new fast_sha256_1.HMAC(CONST_PKG3_UPDATE_KEYS[2].key);
                                        data = new TextEncoder().encode("np_" + results.titleId);
                                        updateHash.update(data);
                                        results.titleUpdateUrl = "http://gs-sec.ww.np.dl.playstation.net/pl/np/" + results.titleId + "/" + toHexString(updateHash.digest()) + "/" + results.titleId + "-ver.xml";
                                    }
                                }
                                else if (results.pkgContentType === 0x1F) {
                                    results.platform = "PSV" /* PSV */;
                                    results.pkgType = "Theme" /* THEME */;
                                    results.pkgExtractRootUx0 = path.join('theme', results.cidTitleId1 + "-" + results.cidTitleId2);
                                    // TODO/FUTURE: bgdl
                                    //  - find next free xxxxxxxx dir (hex 00000000-FFFFFFFF)
                                    //    Note that Vita has issues with handling more than 32 bgdls at once
                                    //  - package sub dir is Results["PKG_CID_TITLE_ID1"] for Game/DLC/Theme
                                    //  - create additional d0/d1.pdb and temp.dat files in root dir for Game/Theme
                                    //  - create additional f0.pdb for DLC
                                    // Results["PKG_EXTRACT_ROOT_UX0"] = os.path.join("bgdl", "t", "xxxxxx")
                                    // , )))
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PSV THEME';
                                }
                                else if (results.pkgContentType === 0x18 || results.pkgContentType === 0x1D) {
                                    results.platform = "PSM" /* PSM */;
                                    results.pkgType = "Game" /* GAME */;
                                    results.pkgExtractRootUx0 = path.join('psm', results.cidTitleId1);
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                    npsType = 'PSM GAME';
                                }
                                else { // Unknown packages
                                    console.error("PKG content type " + results.pkgContentType + ".");
                                    results.pkgExtractRootCont = pkgHeader.contentId.substring(7);
                                }
                            }
                        }
                        else if (magic === CONST_PKG4_MAGIC.toString(16)) {
                            results.platform = "PS4" /* PS4 */;
                            if (results.pkgContentType === 0x1A) {
                                if (results.sfoCategory && results.sfoCategory === 'gd') {
                                    results.pkgType = "Game" /* GAME */;
                                    npsType = 'PS4 GAME';
                                }
                                else if (results.sfoCategory && results.sfoCategory === 'gp') {
                                    results.pkgType = "Update" /* PATCH */;
                                    npsType = 'PS4 UPDATE';
                                }
                            }
                            else if (results.pkgContentType === 0x1B) {
                                if (results.sfoCategory && results.sfoCategory === 'ac') {
                                    results.pkgType = "DLC" /* DLC */;
                                    npsType = 'PS4 DLC';
                                }
                            }
                        }
                        else if (magic === CONST_PBP_MAGIC.toString(16)) { // PBP
                            // TODO
                            results.pkgExtractRootCont = results.titleId;
                        }
                        results.npsType = npsType;
                        sfoValues = null;
                        for (sfoValues in [pbpSfoValues, itemSfoValues, pkgSfoValues]) {
                            if (!sfoValues)
                                continue;
                            // Media Version
                            if (!results.sfoVersion && sfoValues.discVersion) {
                                results.sfoVersion = parseFloat(sfoValues.discVersion);
                            }
                            if (!results.sfoVersion && sfoValues.version) {
                                results.sfoVersion = parseFloat(sfoValues.version);
                            }
                            // Application Version
                            if (!results.sfoAppVer && sfoValues.appVer) {
                                results.sfoAppVer = parseFloat(sfoValues.appVer);
                            }
                            // Firmware PS3
                            if (!results.sfoMinVerPs3 && sfoValues.ps3SystemVer) {
                                results.sfoMinVerPs3 = parseFloat(sfoValues.ps3SystemVer);
                            }
                            // Firmware PSP
                            if (!results.sfoMinVerPsp && sfoValues.pspSystemVer) {
                                results.sfoMinVerPsp = parseFloat(sfoValues.pspSystemVer);
                            }
                            // Firmware PS Vita
                            if (!results.sfoMinVerPsv && sfoValues.psp2DispVer) {
                                results.sfoMinVerPsv = parseFloat(sfoValues.psp2DispVer);
                            }
                            // Firmware PS4
                            if (!results.sfoMinVerPs4 && sfoValues.systemVer) {
                                results.sfoMinVerPs4 = ((sfoValues.systemVer >> 24) & 0xFF) + "." + ((sfoValues.systemVer >> 16) & 0xFF);
                            }
                        }
                        if (!results.sfoAppVer) {
                            results.sfoAppVer = 0x0; // mandatory value
                        }
                        results.sfoMinVer = 0.00; // mandatory value
                        if (results.platform) {
                            if (results.platform === "PS3" /* PS3 */) {
                                if (results.sfoMinVerPs3) {
                                    results.sfoMinVer = results.sfoMinVerPs3;
                                }
                            }
                            else if (results.platform === "PSP" /* PSP */) {
                                if (results.sfoMinVerPsp) {
                                    results.sfoMinVer = results.sfoMinVerPsp;
                                }
                            }
                            else if (results.platform === "PSV" /* PSV */) {
                                if (results.sfoMinVerPsv) {
                                    results.sfoMinVer = results.sfoMinVerPsv;
                                }
                            }
                            else if (results.platform === "PS4" /* PS4 */) {
                                if (results.sfoMinVerPs4) {
                                    results.sfoMinVer = results.sfoMinVerPs4;
                                }
                            }
                        }
                        jsonOutput = {};
                        jsonOutput.results = {};
                        jsonOutput.results.source = this.reader.getSource().href;
                        if (results.titleId)
                            jsonOutput.results.titleId = results.titleId;
                        if (results.sfoTitle)
                            jsonOutput.results.title = results.sfoTitle;
                        if (results.sfoTitleRegional)
                            jsonOutput.results.regionalTitle = results.sfoTitleRegional;
                        if (results.contentId)
                            jsonOutput.results.region = results.region;
                        if (results.sfoMinVer)
                            jsonOutput.results.minFw = results.sfoMinVer;
                        if (results.sfoMinVerPs3 && results.sfoMinVerPs3 >= 0)
                            jsonOutput.results.minFwPs3 = results.sfoMinVerPs3;
                        if (results.sfoMinVerPsp && results.sfoMinVerPsp >= 0)
                            jsonOutput.results.minFwPsp = results.sfoMinVerPsp;
                        if (results.sfoMinVerPsv && results.sfoMinVerPsv >= 0)
                            jsonOutput.results.minFwPsv = results.sfoMinVerPsv;
                        if (results.sfoMinVerPs4 && results.sfoMinVerPs4 >= 0)
                            jsonOutput.results.minFwPs4 = results.sfoMinVerPs4;
                        if (results.sfoSdkVer && results.sfoSdkVer >= 0)
                            jsonOutput.results.sdkVer = results.sfoSdkVer;
                        if (results.sfoCreationDate)
                            jsonOutput.results.creationDate = results.sfoCreationDate;
                        if (results.sfoVersion && results.sfoVersion >= 0)
                            jsonOutput.results.version = results.sfoVersion;
                        if (results.sfoAppVer && results.sfoAppVer >= 0)
                            jsonOutput.results.appVer = results.sfoAppVer;
                        if (results.psxTitleId)
                            jsonOutput.results.psxTitleId = results.psxTitleId;
                        if (results.contentId)
                            jsonOutput.results.contentId = results.contentId;
                        if (results.pkgTotalSize && results.pkgTotalSize > 0) {
                            jsonOutput.results.pkgTotalSize = results.pkgTotalSize;
                            jsonOutput.results.prettySize = humanFileSize(results.pkgTotalSize);
                        }
                        if (results.fileSize)
                            jsonOutput.results.fileSize = results.fileSize;
                        if (results.titleUpdateUrl)
                            jsonOutput.results.titleUpdateUrl = results.titleUpdateUrl;
                        jsonOutput.results.npsType = results.npsType;
                        if (results.platform)
                            jsonOutput.results.pkgPlatform = results.platform;
                        if (results.pkgType)
                            jsonOutput.results.pkgType = results.pkgType;
                        if (results.pkgSubType)
                            jsonOutput.results.pkgSubType = results.pkgSubType;
                        if (results.toolVersion)
                            jsonOutput.results.toolVersion = results.toolVersion;
                        if (results.pkgContentId) {
                            jsonOutput.results.pkgContentId = results.pkgContentId;
                            jsonOutput.results.pkgCidTitleId1 = results.pkgCidTitleId1;
                            jsonOutput.results.pkgCidTitleId2 = results.pkgCidTitleId2;
                        }
                        if (results.mdTitleId) {
                            jsonOutput.results.mdTitleId = results.mdTitleId;
                            if (results.mdTidDiffer) {
                                jsonOutput.results.mdTidDiffer = results.mdTidDiffer;
                            }
                        }
                        if (results.pkgSfoOffset)
                            jsonOutput.results.pkgSfoOffset = results.pkgSfoOffset;
                        if (results.pkgSfoOffset)
                            jsonOutput.results.pkgSfoSize = results.pkgSfoSize;
                        if (results.pkgDrmType)
                            jsonOutput.results.pkgDrmType = results.pkgDrmType;
                        if (results.pkgContentType)
                            jsonOutput.results.pkgContentType = results.pkgContentType;
                        if (results.pkgTailSize)
                            jsonOutput.results.pkgTailSize = results.pkgTailSize;
                        if (results.pkgTailSha1)
                            jsonOutput.results.pkgTailSha1 = results.pkgTailSha1;
                        if (results.itemsInfo) {
                            jsonOutput.results.itemsInfo = results.itemsInfo;
                            if (jsonOutput.results.itemsInfo.align)
                                delete jsonOutput.results.itemsInfo.align;
                        }
                        if (results.sfoTitleId)
                            jsonOutput.results.sfoTitleId = results.sfoTitleId;
                        if (results.sfoCategory)
                            jsonOutput.results.sfoCategory = results.sfoCategory;
                        if (results.sfoContentId) {
                            jsonOutput.results.sfoContentId = results.sfoContentId;
                            jsonOutput.results.sfoCidTitleId1 = results.sfoCidTitleId1;
                            jsonOutput.results.sfoCidTitleId2 = results.sfoCidTitleId2;
                            if (results.sfoCidDiffer)
                                jsonOutput.results.sfoCidDiffer = results.sfoCidDiffer;
                            if (results.sfoTidDiffer)
                                jsonOutput.results.sfoTidDiffer = results.sfoTidDiffer;
                        }
                        return [2 /*return*/, jsonOutput];
                }
            });
        });
    };
    GetInfo.prototype.initReader = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.options.baseUrl) {
                            if (!this.options.baseUrl.endsWith('/')) {
                                this.options.baseUrl += '/';
                            }
                            this.reader = new PkgReader_1.PkgReader(url, this.options.baseUrl);
                        }
                        else {
                            this.reader = new PkgReader_1.PkgReader(url);
                        }
                        if (!url.endsWith('.xml')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reader.setupXml()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!url.endsWith('.json')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.reader.setupJson()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(url.startsWith('http:') || url.startsWith('http:'))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.reader.setupPkg()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return GetInfo;
}());
exports["default"] = GetInfo;
function parsePkg3Header(dataBuffer, reader) {
    return __awaiter(this, void 0, void 0, function () {
        function get(size, fromOffset) {
            if (fromOffset) {
                var slice_1 = dataBuffer.slice(fromOffset, fromOffset + size);
                offset = fromOffset + size;
                return slice_1;
            }
            var slice = dataBuffer.slice(offset, offset + size);
            offset += size;
            return slice;
        }
        var offset, headerFields, readSize, _a, _b, _c, extHeaderFields, mainHdrSize, magic, key, aesEcb, pkgKey, metadata, mdEntryType, mdEntrySize, metaoffset, i, tempBytes;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    offset = 0;
                    headerFields = {
                        magic: get(0x04),
                        rev: get(0x02),
                        type: buf2Int(get(0x02), 4),
                        metadataOffset: buf2Int(get(0x04), 16),
                        metadataCount: buf2Int(get(0x04), 16),
                        metadataSize: get(0x04),
                        itemCount: buf2Int(get(0x04), 16),
                        totalSize: get(0x08),
                        dataOffset: buf2Int(get(0x08), 16),
                        dataSize: get(0x08),
                        contentId: get(0x24).toString(),
                        padding: get(0x0c),
                        digest: get(0x10),
                        dataRiv: get(0x10),
                        keyType: dataBuffer[0xe7] & 7,
                        keyIndex: null,
                        paramSfo: '',
                        aesCtr: {}
                    };
                    readSize = headerFields.dataOffset - CONST_PKG3_HEADER_SIZE;
                    _b = (_a = Buffer).concat;
                    _c = [dataBuffer];
                    return [4 /*yield*/, reader.read(CONST_PKG3_HEADER_SIZE, readSize)];
                case 1:
                    // let unencryptedBytes = await reader.read(CONST_PKG3_HEADER_SIZE, readSize)
                    // const unencryptedBytes = Buffer.concat([dataBuffer, get(readSize, CONST_PKG3_HEADER_SIZE)])
                    // const unencryptedBytes = get(CONST_PKG3_HEADER_SIZE, readSize)
                    // const unencryptedBytes = Buffer.concat([dataBuffer, await reader.read(CONST_PKG3_HEADER_SIZE, readSize)])
                    dataBuffer = _b.apply(_a, [_c.concat([
                            _d.sent()
                        ])]);
                    extHeaderFields = null;
                    mainHdrSize = CONST_PKG3_HEADER_SIZE + CONST_PKG3_DIGEST_SIZE;
                    if (headerFields.type === 0x2) {
                        magic = get(0x04, mainHdrSize);
                        // const magic = unencryptedBytes.slice(mainHdrSize, mainHdrSize + 0x04)
                        if (magic.readInt32BE(0) !== CONST_PKG3_EXT_MAGIC) {
                            reader.close();
                            throw new Error('Not a known PKG3 Extended Main Header');
                            console.error('Not a known PKG3 Extended Main Header');
                        }
                        extHeaderFields = {
                            magic: magic,
                            unknown1: get(0x04),
                            extHeaderSize: get(0x04),
                            extDataSize: get(0x04),
                            mainAndExtHeadersHmacOffset: get(0x04),
                            metadataHeaderHmacOffset: get(0x04),
                            tailOffset: get(0x08),
                            padding1: get(0x04),
                            pkgKeyId: buf2Int(get(0x04), 16),
                            fullHeaderHmacOffset: get(0x04),
                            padding2: get(0x02)
                        };
                    }
                    /*
                      Determine key index for item entries plus path of PARAM.SFO
                     */
                    if (headerFields.type === 0x1) {
                        // PS3
                        headerFields.keyIndex = 0;
                        headerFields.paramSfo = 'PARAM.SFO';
                    }
                    else if (headerFields.type === 0x2) {
                        // PSX/PSP/PSV/PSM
                        headerFields.paramSfo = 'PARAM.SFO';
                        if (extHeaderFields) {
                            headerFields.keyIndex = extHeaderFields.pkgKeyId & 0xf;
                            if (headerFields.keyIndex === 2) {
                                // PSV
                                headerFields.paramSfo = 'sce_sys/param.sfo';
                            }
                            else if (headerFields.keyIndex === 3) {
                                // Unknown
                                console.error("[UNKNOWN] PKG3 Key Index " + headerFields.type);
                                throw new Error("[UNKNOWN] PKG3 Key Index " + headerFields.type);
                            }
                        }
                        else {
                            headerFields.keyIndex = 1;
                        }
                    }
                    else {
                        console.error("[UNKNOWN] PKG3 Package Type " + headerFields.type);
                        // throw new Error(`[UNKNOWN] PKG3 Package Type ${headerFields.type}`)
                    }
                    for (key in CONST_PKG3_CONTENT_KEYS) {
                        // console.log('key: ' + CONST_PKG3_CONTENT_KEYS[key])
                        if (CONST_PKG3_CONTENT_KEYS[key].derive) {
                            aesEcb = new aesjs.ModeOfOperation.ecb(CONST_PKG3_CONTENT_KEYS[key].key);
                            pkgKey = aesEcb.encrypt(headerFields.dataRiv);
                            headerFields.aesCtr[key] = new PkgAesCounter_1.PkgAesCounter(pkgKey, headerFields.dataRiv);
                            //   aes: aesEcb,
                            //   pkgKey: aesjs.utils.hex.fromBytes(pkgKey),
                            //   setOffset: function(offset: number) {
                            //
                            //   },
                            //   decrypt: function(offset, data) {
                            //     return this.aes.utils.utf8.fromBytes(this.aes.decrypt(pkgKey))
                            //   }
                            // }
                            // aesjs.utils.hex.fromBytes(pkgKey)
                        }
                        else {
                            // console.log("doesn't have derive")
                            // headerFields.aesCtr[key] = CONST_PKG3_CONTENT_KEYS[key]
                            // headerFields.aesCtr[key] = aesjs.utils.hex.fromBytes(CONST_PKG3_CONTENT_KEYS[key].key)
                            headerFields.aesCtr[key] = new PkgAesCounter_1.PkgAesCounter(CONST_PKG3_CONTENT_KEYS[key].key, headerFields.dataRiv);
                        }
                    }
                    metadata = {};
                    mdEntryType = -1;
                    mdEntrySize = -1;
                    metaoffset = headerFields.metadataOffset;
                    for (i = 0; i < headerFields.metadataCount; i++) {
                        // let type = get(4);
                        // const type = unencryptedBytes.slice(metaoffset, metaoffset + 4)
                        // mdEntryType = unencryptedBytes.slice(metaoffset, metaoffset + 4).readInt32BE(0)
                        mdEntryType = dataBuffer.slice(metaoffset, metaoffset + 4).readInt32BE(0);
                        metaoffset += 4;
                        // let size = get(4)
                        // mdEntrySize = unencryptedBytes.slice(metaoffset, metaoffset + 4).readInt32BE(0)
                        mdEntrySize = dataBuffer.slice(metaoffset, metaoffset + 4).readInt32BE(0);
                        // const size = unencryptedBytes.slice(metaoffset, metaoffset + 4)
                        metaoffset += 4;
                        tempBytes = dataBuffer.slice(metaoffset, metaoffset + mdEntrySize);
                        // let tempBytes = unencryptedBytes.slice(metaoffset, metaoffset + mdEntrySize)
                        metadata[mdEntryType] = {};
                        // (1) DRM Type
                        // (2) Content Type
                        if (mdEntryType === 0x01 || mdEntryType === 0x02) {
                            if (mdEntryType === 0x01) {
                                metadata[mdEntryType].desc = 'DRM Type';
                            }
                            else if (mdEntryType === 0x02) {
                                metadata[mdEntryType].desc = 'Content Type';
                            }
                            metadata[mdEntryType].value = tempBytes.readInt32BE(0);
                            if (mdEntrySize > 0x04) {
                                metadata[mdEntryType].unknown = tempBytes.slice(0x04);
                            }
                        }
                        // (6) Title ID (when size 0xC) (otherwise Version + App Version)
                        else if (mdEntryType === 0x06 && mdEntrySize === 0x0c) {
                            if (mdEntryType === 0x06) {
                                metadata[mdEntryType].desc = 'Title ID';
                            }
                            metadata[mdEntryType].value = tempBytes.toString();
                        }
                        // (10) Install Directory
                        else if (mdEntryType === 0x0a) {
                            if (mdEntryType === 0x0a) {
                                metadata[mdEntryType].desc = 'Install Directory';
                            }
                            metadata[mdEntryType].unknown = tempBytes.slice(0, 0x8);
                            metadata[mdEntryType].value = tempBytes.slice(0x8).toString();
                        }
                        // (13) Items Info (PS Vita)
                        else if (mdEntryType === 0x0d) {
                            if (mdEntryType === 0x0d) {
                                metadata[mdEntryType].desc = 'Items Info (SHA256 of decrypted data)';
                            }
                            metadata[mdEntryType].ofs = tempBytes.readInt32BE(0);
                            metadata[mdEntryType].size = tempBytes.readInt32BE(0x04);
                            metadata[mdEntryType].sha256 = tempBytes.slice(0x08, 0x08 + 0x20);
                            if (mdEntrySize > 0x28) {
                                metadata[mdEntryType].unknown = tempBytes.slice(0x28);
                            }
                        }
                        // (14) PARAM.SFO Info (PS Vita)
                        // (15) Unknown Info (PS Vita)
                        // (16) Entirety Info (PS Vita)
                        // (18) Self Info (PS Vita)
                        else if (mdEntryType === 0x0e ||
                            mdEntryType === 0x0f ||
                            mdEntryType === 0x10 ||
                            mdEntryType === 0x12) {
                            if (mdEntryType === 0x0e) {
                                metadata[mdEntryType].desc = 'PARAM.SFO Info';
                            }
                            else if (mdEntryType === 0x10) {
                                metadata[mdEntryType].desc = 'Entirety Info';
                            }
                            else if (mdEntryType === 0x12) {
                                metadata[mdEntryType].desc = 'Self Info';
                            }
                            metadata[mdEntryType].ofs = tempBytes.readInt32BE(0);
                            metadata[mdEntryType].size = tempBytes.readInt32BE(0x04);
                            if (mdEntryType === 0x0e) {
                                metadata[mdEntryType].unknown1 = tempBytes.slice(0x08, 0x08 + 4);
                                metadata[mdEntryType].firmware = tempBytes.slice(0x0c, 0x0c + 4);
                                metadata[mdEntryType].unknown2 = tempBytes.slice(0x10, mdEntrySize - 0x20);
                            }
                            else {
                                metadata[mdEntryType].unknown = tempBytes.slice(0x08, mdEntrySize - 0x20);
                            }
                            metadata[mdEntryType].sha256 = tempBytes.slice(mdEntrySize - 0x20);
                        }
                        else {
                            if (mdEntryType === 0x03) {
                                metadata[mdEntryType].desc = 'Package Type/Flags';
                            }
                            else if (mdEntryType === 0x04) {
                                metadata[mdEntryType].desc = 'Package Size';
                            }
                            else if (mdEntryType === 0x06) {
                                metadata[mdEntryType].desc = 'Version + App Version';
                            }
                            else if (mdEntryType === 0x07) {
                                metadata[mdEntryType].desc = 'QA Digest';
                            }
                            metadata[mdEntryType].value = tempBytes;
                        }
                        // // Unknown element found; seen in PSP cumulative patch
                        // if (type.readInt32BE(0) === 0xB) { // 11
                        //   metadataFields.type0B = true
                        // }
                        // PARAM.SFO offset and size element found
                        // if (type.readInt32BE(0) === 0xE) { // 14
                        //   metadataFields.sfoOffset = unencryptedBytes.slice(metaoffset + 8, metaoffset + 12);
                        //   metadataFields.sfoSize = unencryptedBytes.slice(metaoffset + 12, metaoffset + 16)
                        // }
                        metaoffset += mdEntrySize;
                    }
                    headerFields.metadataSize = metaoffset - headerFields.metadataOffset;
                    return [2 /*return*/, {
                            pkgHeader: headerFields,
                            pkgExtHeader: extHeaderFields,
                            pkgMetadata: metadata,
                            headBytes: dataBuffer
                        }];
            }
        });
    });
}
function retrieveParamSfo(pkg, results, reader) {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pkg.headBytes.length >= results.pkgSfoOffset + results.pkgSfoSize) {
                        return [2 /*return*/, pkg.headBytes.slice(results.pkgSfoOffset, results.pkgSfoOffset + results.pkgSfoSize)];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, reader.read(results.pkgSfoOffset, results.pkgSfoSize)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_3 = _a.sent();
                    reader.close();
                    throw new Error("Could not get PARAM.SFO at offset " + results.pkgSfoOffset + " with size " + results.pkgSfoSize + " from " + reader.getSource());
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkSfoMagic(sfoMagic, reader) {
    if (buf2Int(sfoMagic, 16) !== CONST_PARAM_SFO_MAGIC) {
        reader.close();
        throw new Error("Not a known PARAM.SFO structure");
    }
    return;
}
function parseSfo(sfoBytes) {
    return __awaiter(this, void 0, void 0, function () {
        var sfoKeyTableStart, sfoDataTableStart, sfoTableEntries, sfoValues, i, sfoIndexEntryOfs, sfoIndexKeyOfs, sfoIndexKey, charArr, j, sfoIndexKeyName, sfoIndexDataOfs, sfoIndexDataFmt, sfoIndexDataLen, sfoIndexData, value;
        return __generator(this, function (_a) {
            sfoBytes = Buffer.from(sfoBytes);
            sfoKeyTableStart = sfoBytes.readInt32LE(0x08);
            sfoDataTableStart = sfoBytes.readInt32LE(0x0c);
            sfoTableEntries = sfoBytes.readInt32LE(0x10);
            sfoValues = {};
            for (i = 0; i < sfoTableEntries; i++) {
                sfoIndexEntryOfs = 0x14 + i * 0x10;
                sfoIndexKeyOfs = sfoKeyTableStart + sfoBytes.readInt16LE(sfoIndexEntryOfs);
                sfoIndexKey = '';
                charArr = sfoBytes.slice(sfoIndexKeyOfs).toString();
                // console.log(charArr)
                for (j = 0; j < charArr.length; j++) {
                    if (charArr.charAt(j) === '\u0000') {
                        break;
                    }
                    sfoIndexKey += charArr.charAt(j);
                }
                sfoIndexKeyName = sfoIndexKey.toString();
                sfoIndexDataOfs = sfoDataTableStart + sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x0c);
                sfoIndexDataFmt = sfoBytes.readInt16LE(sfoIndexEntryOfs + 0x02);
                sfoIndexDataLen = sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x04);
                sfoIndexData = sfoBytes.slice(sfoIndexDataOfs, sfoIndexDataOfs + sfoIndexDataLen);
                value = void 0;
                if (sfoIndexDataFmt === 0x0004 || sfoIndexDataFmt === 0x0204) {
                    // if (sfoIndexDataFmt === 0x0204) {
                    //
                    // }
                    value = sfoIndexData.toString();
                }
                else if (sfoIndexDataFmt === 0x0404) {
                    value = sfoIndexData.readInt32LE(0);
                }
                sfoValues[sfoIndexKeyName] = value;
            }
            return [2 /*return*/, sfoValues];
        });
    });
}
function calculateAesAlignedOffsetAndSize(offset, size) {
    var align = {};
    // Decrement AES block size (16)
    align.ofsDelta = offset & (0x10 - 1);
    align.ofs = offset - align.ofsDelta;
    align.sizeDelta = (align.ofsDelta + size) & (0x10 - 1);
    if (align.sizeDelta > 0) {
        align.sizeDelta = 0x10 - align.sizeDelta;
    }
    align.sizeDelta += align.ofsDelta;
    align.size = size + align.sizeDelta;
    return align;
}
function parsePkg3ItemsInfo(headerFields, metaData, reader) {
    return __awaiter(this, void 0, void 0, function () {
        var itemsInfoBytes, _a, _b, e_4, pkgItemEntries, offset, nameOffsetEnd, itemNameSizeMax, slicer, i, tempFields, itemFlags, readSize, readOffset, _c, _d, _e, _f, _g, e_5, align, _i, pkgItemEntries_2, itemEntry, keyIndex, align, tmp, hasher;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    itemsInfoBytes = {};
                    itemsInfoBytes.ofs = 0;
                    itemsInfoBytes.size = headerFields.itemCount * CONST_PKG3_ITEM_ENTRY_SIZE;
                    itemsInfoBytes.align = {};
                    itemsInfoBytes.entriesSize =
                        headerFields.itemCount * CONST_PKG3_ITEM_ENTRY_SIZE;
                    if (metaData[0x0d]) {
                        itemsInfoBytes.ofs = metaData[0x0d].ofs;
                        if (itemsInfoBytes.size < metaData[0x0d].size) {
                            itemsInfoBytes.size = metaData[0x0d].size;
                        }
                    }
                    itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, itemsInfoBytes.size);
                    if (itemsInfoBytes.align.ofsDelta > 0) {
                        console.error("Unaligned encrypted offset     " + itemsInfoBytes.ofs + " - " + itemsInfoBytes.align.ofsDelta + " =     " + itemsInfoBytes.align.ofs + " (+ " + headerFields.dataOffset + ") for Items Info/Items Entries.");
                    }
                    itemsInfoBytes[CONST_DATATYPE_AS_IS] = [];
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 3, , 4]);
                    _a = itemsInfoBytes;
                    _b = CONST_DATATYPE_AS_IS;
                    return [4 /*yield*/, reader.read(headerFields.dataOffset + itemsInfoBytes.align.ofs, itemsInfoBytes.align.size)
                        // itemsInfoBytes[CONST_DATATYPE_AS_IS] = Buffer.concat([itemsInfoBytes[CONST_DATATYPE_AS_IS], await reader.read(headerFields.dataOffset + itemsInfoBytes.align.ofs, itemsInfoBytes.align.size)])
                    ];
                case 2:
                    _a[_b] = _h.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _h.sent();
                    reader.close();
                    throw new Error("Could not get PKG3 encrypted data at     offset " + (headerFields.dataOffset + itemsInfoBytes.align.ofs) + " with     size " + itemsInfoBytes.align.size + " from " + reader.getSource());
                case 4:
                    // Decrypt PKG3 Item Entries
                    itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = headerFields.aesCtr[headerFields.keyIndex].decrypt(itemsInfoBytes.align.ofs, itemsInfoBytes[CONST_DATATYPE_AS_IS]);
                    pkgItemEntries = [];
                    offset = itemsInfoBytes.align.ofsDelta;
                    itemsInfoBytes.namesOfs = null;
                    nameOffsetEnd = null;
                    itemNameSizeMax = 0;
                    slicer = new Slicer_1.Slicer(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]);
                    for (i = 0; i < headerFields.itemCount; i++) {
                        tempFields = new PKG3ItemEntry({
                            itemNameOfs: buf2Int(slicer.get(0x4), 16),
                            itemNameSize: buf2Int(slicer.get(0x4), 16),
                            dataOfs: buf2Int(slicer.get(0x8), 16),
                            dataSize: buf2Int(slicer.get(0x8), 16),
                            flags: buf2Int(slicer.get(0x4), 16),
                            padding1: buf2Int(slicer.get(0x4), 16),
                            index: i
                        });
                        if (tempFields.align.ofsDelta > 0) {
                            console.error("Unaligned encrypted offset " + tempFields.dataOfs + " - " + tempFields.align.ofsDelta + " = " + tempFields.align.ofs + " (+" + headerFields.dataOffset + ")");
                        }
                        itemFlags = tempFields.flags & 0xff;
                        if (itemFlags === 0x4 || itemFlags === 0x12) {
                            // directory
                            tempFields.isFileOfs = -1;
                        }
                        else {
                            tempFields.isFileOfs = tempFields.dataOfs;
                        }
                        pkgItemEntries.push(tempFields);
                        if (tempFields.itemNameSize > 0) {
                            if (itemsInfoBytes.namesOfs === null ||
                                tempFields.itemNameOfs < itemsInfoBytes.namesOfs) {
                                itemsInfoBytes.namesOfs = tempFields.itemNameOfs;
                            }
                            if (nameOffsetEnd === null || tempFields.itemNameOfs >= nameOffsetEnd) {
                                nameOffsetEnd = tempFields.itemNameOfs + tempFields.itemNameSize;
                            }
                            if (tempFields.itemNameSize > itemNameSizeMax) {
                                itemNameSizeMax = tempFields.itemNameSize;
                            }
                        }
                        offset += CONST_PKG3_ITEM_ENTRY_SIZE;
                    }
                    itemsInfoBytes.namesSize = nameOffsetEnd - itemsInfoBytes.namesOfs;
                    // Check if Item Names follow immediately after Item Entries (relative offsets inside Items Info)
                    if (itemsInfoBytes.namesOfs < itemsInfoBytes.entriesSize) {
                        console.error("Item Names with offset " + itemsInfoBytes.namesOfs + " are INTERLEAVED with the Item Entries of size " + itemsInfoBytes.entriesSize + ".");
                        console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                    }
                    else if (itemsInfoBytes.namesOfs > itemsInfoBytes.entriesSize) {
                        console.error("Item Names with offset " + itemsInfoBytes.namesOfs + " are not directly following the Item Entries with size " + itemsInfoBytes.entriesSize);
                        console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                    }
                    readSize = itemsInfoBytes.namesOfs + itemsInfoBytes.namesSize;
                    if (!(readSize > itemsInfoBytes.size)) return [3 /*break*/, 9];
                    if (metaData[0x0d] && metaData[0x0d].size >= itemsInfoBytes.entriesSize) {
                        // meta data size too small for whole Items Info
                        console.error("Items Info size " + metaData[0x0d].size + " from meta data 0x0D is too small for complete Items Info (Entries+Names) with total size of " + readSize);
                        console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                    }
                    itemsInfoBytes.size = readSize;
                    itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, itemsInfoBytes.size);
                    readOffset = itemsInfoBytes.align.ofs + itemsInfoBytes[CONST_DATATYPE_AS_IS].length;
                    readSize =
                        itemsInfoBytes.align.size - itemsInfoBytes[CONST_DATATYPE_AS_IS].length;
                    _h.label = 5;
                case 5:
                    _h.trys.push([5, 7, , 8]);
                    _c = itemsInfoBytes;
                    _d = CONST_DATATYPE_AS_IS;
                    _f = (_e = Buffer).concat;
                    _g = [Buffer.from(itemsInfoBytes[CONST_DATATYPE_AS_IS])];
                    return [4 /*yield*/, reader.read(headerFields.dataOffset + readOffset, readSize)];
                case 6:
                    _c[_d] = _f.apply(_e, [_g.concat([
                            _h.sent()
                        ])]);
                    return [3 /*break*/, 8];
                case 7:
                    e_5 = _h.sent();
                    reader.close();
                    throw new Error("Could not get PKG3 encrypted data at offset " + (headerFields.dataOffset +
                        readOffset) + " with size " + readSize + " from " + reader.getSource());
                case 8:
                    itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = Buffer.concat([
                        Buffer.from(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]),
                        itemsInfoBytes[CONST_DATATYPE_AS_IS].slice(itemsInfoBytes[CONST_DATATYPE_DECRYPTED.length]),
                    ]);
                    return [3 /*break*/, 10];
                case 9:
                    if (metaData[0x0d]) {
                        align = calculateAesAlignedOffsetAndSize(itemsInfoBytes.ofs, readSize);
                        if (align.size !== metaData[0x0d].size) {
                            console.error("Determined aligned Items Info size " + align.size + " <> " + metaData[0x0d].size + " from meta data 0x0D.");
                            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                        }
                    }
                    _h.label = 10;
                case 10:
                    // Decrypt and Parse PKG3 Item Names
                    for (_i = 0, pkgItemEntries_2 = pkgItemEntries; _i < pkgItemEntries_2.length; _i++) {
                        itemEntry = pkgItemEntries_2[_i];
                        if (itemEntry.itemNameSize <= 0) {
                            continue;
                        }
                        keyIndex = itemEntry.keyIndex;
                        offset = itemsInfoBytes.ofs + itemEntry.itemNameOfs;
                        align = calculateAesAlignedOffsetAndSize(offset, itemEntry.itemNameSize);
                        if (align.ofsDelta > 0) {
                            console.error("Unaligned encrypted offset " + offset + " - " + align.ofsDelta + " = " + align.ofs + " (+ " + headerFields.dataOffset + ") for " + itemEntry.index + " item name.");
                            console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                        }
                        offset = align.ofs - itemsInfoBytes.align.ofs;
                        tmp = itemsInfoBytes[CONST_DATATYPE_DECRYPTED].slice(offset + align.ofsDelta, offset + align.ofsDelta + itemEntry.itemNameSize);
                        itemsInfoBytes[CONST_DATATYPE_DECRYPTED].set(tmp, offset);
                        itemEntry.name = buf2Str(tmp);
                    }
                    hasher = new fast_sha256_1.Hash();
                    hasher.update(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]);
                    itemsInfoBytes.sha256 = hasher.digest();
                    if (metaData[0x0d] &&
                        buf2hex(itemsInfoBytes.sha256) !== buf2hex(metaData[0x0d].sha256)) {
                        console.error('Calculated SHA-256 of decrypted Items Info does not match the one from meta data 0x0D.');
                        console.error(itemsInfoBytes.sha256 + " <> " + metaData[0x0d].sha256);
                        console.error('Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info');
                    }
                    // Further analysys data
                    itemsInfoBytes.fileOfs = headerFields.dataOffset + itemsInfoBytes.ofs;
                    itemsInfoBytes.fileOfsEnd = itemsInfoBytes.fileOfs + itemsInfoBytes.size;
                    return [2 /*return*/, { itemsInfoBytes: itemsInfoBytes, pkgItemEntries: pkgItemEntries }];
            }
        });
    });
}
function processPkg3Item(extractionsFields, itemEntry, reader, itemData, size, extractions) {
    if (size === void 0) { size = null; }
    if (extractions === void 0) { extractions = null; }
    return __awaiter(this, void 0, void 0, function () {
        var itemDataUsable, addItemData, key, extract, align, dataOffset, fileOffset, restSize, encryptedBytes, decryptedBytes, blockDataOfs, blockDataSizeDelta, blockSize, blockDataSize, e_6, key, extract, writeBytes, key, extract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemDataUsable = 0;
                    addItemData = false;
                    if (itemData !== null) {
                        if (itemData.add) {
                            addItemData = true;
                            if (!itemData[CONST_DATATYPE_AS_IS]) {
                                itemData[CONST_DATATYPE_AS_IS] = [];
                            }
                            if (!itemData[CONST_DATATYPE_DECRYPTED]) {
                                itemData[CONST_DATATYPE_DECRYPTED] = [];
                            }
                        }
                        if (itemData[CONST_DATATYPE_AS_IS]) {
                            itemDataUsable = itemData[CONST_DATATYPE_AS_IS].length;
                        }
                    }
                    if (extractions) {
                        for (key in extractions) {
                            extract = extractions[key];
                            extract.itemBytesWritten = 0;
                        }
                    }
                    align = null;
                    if (size === null) {
                        size = itemEntry.dataSize;
                        align = itemEntry.align;
                    }
                    else {
                        align = calculateAesAlignedOffsetAndSize(itemEntry.dataOfs, size);
                    }
                    dataOffset = align.ofs;
                    fileOffset = extractionsFields.dataOffset + dataOffset;
                    restSize = align.size;
                    encryptedBytes = null;
                    decryptedBytes = null;
                    blockDataOfs = align.ofsDelta;
                    blockDataSizeDelta = 0;
                    blockSize = null;
                    _a.label = 1;
                case 1:
                    if (!(restSize > 0)) return [3 /*break*/, 7];
                    // Calculate next data block
                    if (itemDataUsable > 0) {
                        blockSize = itemDataUsable;
                    }
                    else {
                        blockSize = restSize;
                        // blockSize = Math.min(restSize, CONST_READ_SIZE)
                    }
                    if (restSize <= blockSize) {
                        // final block
                        blockDataSizeDelta = align.sizeDelta - align.ofsDelta;
                    }
                    blockDataSize = blockSize - blockDataOfs - blockDataSizeDelta;
                    if (!(itemDataUsable > 0)) return [3 /*break*/, 2];
                    encryptedBytes = itemData[CONST_DATATYPE_AS_IS];
                    return [3 /*break*/, 6];
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, reader.read(fileOffset, blockSize)];
                case 3:
                    encryptedBytes = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_6 = _a.sent();
                    reader.close();
                    throw new Error("Could not get PKG3 encrypted data at offset " + (extractionsFields.dataOffset +
                        align.ofs) + " with size " + align.size + " from " + reader.getSource());
                case 5:
                    if (addItemData) {
                        itemData[CONST_DATATYPE_AS_IS] = encryptedBytes;
                    }
                    _a.label = 6;
                case 6:
                    // Get and process decrypted block
                    if (itemEntry.keyIndex && extractionsFields.aesCtr) {
                        if (itemDataUsable > 0) {
                            decryptedBytes = itemData[CONST_DATATYPE_DECRYPTED];
                        }
                        else {
                            decryptedBytes = extractionsFields.aesCtr[itemEntry.keyIndex].decrypt(dataOffset, encryptedBytes);
                            if (addItemData) {
                                itemData[CONST_DATATYPE_DECRYPTED] = decryptedBytes;
                            }
                        }
                    }
                    // Write extractions
                    if (extractions) {
                        for (key in extractions) {
                            extract = extractions[key];
                            // console.debug(extract)
                            if (!extract.request) {
                                continue;
                            }
                            writeBytes = null;
                            if (extract.itemDataType === CONST_DATATYPE_AS_IS) {
                                writeBytes = encryptedBytes;
                            }
                            else if (extract.itemDataType === CONST_DATATYPE_DECRYPTED) {
                                writeBytes = decryptedBytes;
                            }
                            else {
                                continue;
                                // TODO: error handling
                            }
                            if (extract.aligned) {
                                // extract.itemBytesWritten += extract.request
                                // todo: ln 2073
                            }
                            else {
                                // extract.itemBytesWritten += extract.request.write
                                // todo: ln 2075
                            }
                        }
                    }
                    // Prepare for next data block
                    restSize -= blockSize;
                    fileOffset += blockSize;
                    dataOffset += blockSize;
                    blockDataOfs = 0;
                    itemDataUsable = 0;
                    return [3 /*break*/, 1];
                case 7:
                    // Clean up extractions
                    if (extractions) {
                        for (key in extractions) {
                            extract = extractions[key];
                            if (extract.request) {
                                extract.bytesWritten += extract.itemBytesWritten;
                            }
                        }
                    }
                    return [2 /*return*/, itemData];
            }
        });
    });
}
function parsePbpHeader(headBytes, fileSize, reader) {
    return __awaiter(this, void 0, void 0, function () {
        var slicer, pbpHeaderFields, unencryptedBytes, readSize, _a, _b, _c, e_7, itemEntries, itemIndex, lastItem, key, itemEntry;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    slicer = new Slicer_1.Slicer(headBytes);
                    pbpHeaderFields = {
                        magic: slicer.get(0x04),
                        version: slicer.get(0x04),
                        paramSfoOfs: slicer.get(0x04),
                        icon0PngOfs: slicer.get(0x04),
                        icon1PmfOfs: slicer.get(0x04),
                        pic0PngOfs: slicer.get(0x04),
                        pic1PngOfs: slicer.get(0x04),
                        snd0At3Ofs: slicer.get(0x04),
                        dataPspOfs: slicer.get(0x04),
                        dataPsarOfs: slicer.get(0x04)
                    };
                    console.debug(pbpHeaderFields);
                    unencryptedBytes = new Uint8Array([]);
                    if (!reader) return [3 /*break*/, 4];
                    readSize = pbpHeaderFields.icon0PngOfs - CONST_PBP_HEADER_SIZE;
                    unencryptedBytes = headBytes;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    _b = (_a = Buffer).concat;
                    _c = [unencryptedBytes];
                    return [4 /*yield*/, reader.read(CONST_PBP_HEADER_SIZE, readSize)];
                case 2:
                    unencryptedBytes = _b.apply(_a, [_c.concat([
                            _d.sent()
                        ])]);
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _d.sent();
                    reader.close();
                    throw new Error("Could not get PBP unencrypted data at offset " + CONST_PBP_HEADER_SIZE + " with size " + readSize + " from " + reader.getSource());
                case 4:
                    itemEntries = [];
                    itemIndex = 0;
                    lastItem = 0;
                    for (key in pbpHeaderFields) {
                        itemEntry = new PBPItemEntry({
                            index: itemIndex,
                            dataOfs: pbpHeaderFields[key],
                            isFileOfs: pbpHeaderFields[key]
                        });
                        // itemEntry.
                        // itemEntry.structureDef
                        // itemEntry.dataOfs = pbpHeaderFields[key]
                        // itemEntry.isFileOfs = itemEntry.dataOfs
                        if (lastItem) {
                            itemEntries[lastItem].dataSize =
                                itemEntry.dataOfs - itemEntries[lastItem].dataOfs;
                            itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(itemEntries[lastItem].dataOfs, itemEntries[lastItem].dataSize);
                        }
                        lastItem = itemIndex;
                        if (key === 'paramSfoOfs') {
                            itemEntry.name = 'PARAM.SFO';
                        }
                        else if (key === 'icon0PngOfs') {
                            itemEntry.name = 'ICON0.PNG';
                        }
                        else if (key === 'icon1PmfOfs') {
                            itemEntry.name = 'ICON1.PMF';
                        }
                        else if (key === 'pic0PngOfs') {
                            itemEntry.name = 'PIC0.PNG';
                        }
                        else if (key === 'pic1PngOfs') {
                            itemEntry.name = 'PIC1.PNG';
                        }
                        else if (key === 'snd0At3Ofs') {
                            itemEntry.name = 'SND0.AT3';
                        }
                        else if (key === 'dataPspOfs') {
                            itemEntry.name = 'DATA.PSP';
                        }
                        else if (key === 'dataPsarOfs') {
                            itemEntry.name = 'DATA.PSAR';
                        }
                        itemEntries.push(itemEntry);
                        itemIndex += 1;
                    }
                    if (lastItem) {
                        itemEntries[lastItem].dataSize = fileSize - itemEntries[lastItem].dataOfs;
                        itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(itemEntries[lastItem].dataOfs, itemEntries[lastItem].dataSize);
                    }
                    return [2 /*return*/, { pbpHeaderFields: pbpHeaderFields, itemEntries: itemEntries }];
            }
        });
    });
}
function getRegion(id) {
    // For definition see http://www.psdevwiki.com/ps3/Productcode
    //                    http://www.psdevwiki.com/ps3/PARAM.SFO#TITLE_ID
    //                    http://www.psdevwiki.com/ps4/Regioning
    //
    //                    https://playstationdev.wiki/psvitadevwiki/index.php?title=Languages
    //                    http://www.psdevwiki.com/ps3/Languages
    //                    http://www.psdevwiki.com/ps3/PARAM.SFO#TITLE
    //                    http://www.psdevwiki.com/ps4/Languages
    switch (id) {
        case 'A':
            return { region: 'ASIA', languages: ['09', '11', '10', '00'] };
        case 'E':
            return { region: 'EU', languages: ['01', '18'] };
        case 'H':
            return { region: 'ASIA(HKG)', languages: ['11', '10'] };
        case 'I':
            return { region: 'INT', languages: ['01', '18'] };
        case 'J':
            return { region: 'JP', languages: ['00'] };
        case 'K':
            return { region: 'ASIA(KOR)', languages: ['09'] };
        case 'U':
            return { region: 'US', languages: ['01'] };
        default:
            return { region: '???', languages: null };
    }
}
function buf2hex(buffer) {
    var s = '';
    var h = '0123456789ABCDEF';
    new Uint8Array(buffer).forEach(function (v) {
        s += h[v >> 4] + h[v & 15];
    });
    return s;
}
function buf2Int(bytes, radix) {
    if (radix === void 0) { radix = 16; }
    return parseInt(buf2hex(bytes), radix);
}
function buf2Str(bytes) {
    var str = '';
    for (var i = 0; i < bytes.byteLength; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}
function toHexString(byteArray) {
    return Array.prototype.map
        .call(byteArray, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
        .join('');
}
function toByteArray(hex) {
    var result = [];
    while (hex.length >= 2) {
        result.push(parseInt(hex.substring(0, 2), 16));
        hex = hex.substring(2, hex.length);
    }
    return result;
}
function humanFileSize(bytes, si) {
    if (si === void 0) { si = false; }
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}
