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
var axios_1 = require("axios");
var CONST_PKG3_XML_ROOT = 'hfs_manifest';
var CONST_READ_SIZE = (function () {
    var min = Math.ceil(50);
    var max = Math.floor(100);
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand * 0x100000;
})();
var CONST_READ_AHEAD_SIZE = 128 * 0x400;
var CONST_USER_AGENT_PS3 = "Mozilla/5.0 (PLAYSTATION 3; 4.84)";
// const CONST_USER_AGENT_PSP = ""
var CONST_USER_AGENT_PSV = " libhttp/3.70 (PS Vita)";
var CONST_USER_AGENT_PS4 = "Download/1.00 libhttp/6.50 (PlayStation 4)";
var PkgReader = /** @class */ (function () {
    function PkgReader(url, baseUrl) {
        this.parts = [];
        this.baseUrl = baseUrl || '';
        this.source = new URL(this.baseUrl + url);
        this.pkgName = 'UNKNOWN';
        this.size = 0;
        this.multipart = false;
        this.partsCount = 0;
        this.buffer = Buffer.from([]);
        this.bufferSize = 0;
        this.headers = {};
        // if (this.source.href.endsWith('.xml')) {
        //   this.setupXml()
        // } else if (this.source.href.endsWith('.json')) {
        //   console.error(".json URLs aren't implemented")
        // } else {
        //   if (this.source.href.startsWith('http:') || this.source.href.startsWith('http:')) {
        //     this.setupPkg()
        //   }
    }
    PkgReader.prototype.open = function (filePart) {
        return __awaiter(this, void 0, void 0, function () {
            var partSize, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (filePart.request) {
                            return [2 /*return*/];
                        }
                        partSize = null;
                        if (!(filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:'))) return [3 /*break*/, 2];
                        filePart.request = axios_1["default"].create({
                            headers: this.headers,
                            responseType: 'arraybuffer'
                        });
                        return [4 /*yield*/, filePart.request.head(filePart.url.href)];
                    case 1:
                        response = _a.sent();
                        if (response.headers['content-length']) {
                            partSize = response.headers['content-length'];
                        }
                        // Check file size
                        if (partSize !== null) {
                            if (filePart.size) {
                                console.error("[INPUT] File size differs from meta data " + partSize + " <> " + filePart.size);
                            }
                            else {
                                filePart.size = partSize;
                                filePart.endOfs = Number(filePart.startOfs) + Number(filePart.size);
                            }
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PkgReader.prototype.read = function (offset, size) {
        return __awaiter(this, void 0, void 0, function () {
            var result, readOffset, readSize, readBufferSize, count, lastCount, filePart, fileOffset, readBufferSize, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        readOffset = offset;
                        readSize = size;
                        if (readSize < 0) {
                            throw new Error('Negative read size');
                        }
                        if (this.buffer && (this.bufferSize > readOffset) && (readSize > 0)) {
                            readBufferSize = readSize;
                            if ((readOffset + readBufferSize) > this.bufferSize) {
                                readBufferSize = this.bufferSize - readOffset;
                            }
                            result.push(this.buffer.slice(readOffset, readOffset + readBufferSize));
                            // result = Buffer.concat(result, this.buffer.slice(readOffset, readOffset + readBufferSize));
                            // let b =
                            // result.set(this.buffer.slice(readOffset, readOffset + readBufferSize), 0)
                            // result.push() = result. (result, 0, 0, )
                            readOffset += readBufferSize;
                            readSize -= readBufferSize;
                        }
                        count = 0;
                        lastCount = -1;
                        _a.label = 1;
                    case 1:
                        if (!(readSize > 0)) return [3 /*break*/, 4];
                        while ((count < this.partsCount) && (this.parts[count].startOfs <= readOffset)) {
                            count += 1;
                        }
                        count -= 1;
                        if (lastCount === count) {
                            throw new Error("[INPUT] Read offset " + readOffset + " out of range (max. " + (this.size - 1) + ")");
                        }
                        lastCount = count;
                        filePart = this.parts[count];
                        fileOffset = readOffset - filePart.startOfs;
                        readBufferSize = readSize;
                        if ((readOffset + readBufferSize) > filePart.endOfs) {
                            readBufferSize = filePart.endOfs - readOffset;
                        }
                        return [4 /*yield*/, this.open(filePart)
                            // if (filePart.streamType === "requests") {
                            //   const reqHeaders = {
                            //     "Range": `bytes=${fileOffset}-${fileOffset + readBufferSize - 1}`,
                            //   };
                            // filePart.stream.create()
                        ];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, filePart.request.get(filePart.url.href, {
                                headers: {
                                    Range: "bytes=" + fileOffset + "-" + (fileOffset + readBufferSize - 1)
                                },
                                responseType: 'arraybuffer'
                            })];
                    case 3:
                        response = _a.sent();
                        result.push(Buffer.from(response.data));
                        // result =_.concat(result, response.data)
                        // result. response.data, result.length)
                        // result.push(response.data);
                        // }
                        readOffset += readBufferSize;
                        readSize -= readBufferSize;
                        return [3 /*break*/, 1];
                    case 4: 
                    // return result
                    // return Buffer.from(result);
                    return [2 /*return*/, Buffer.concat(result)
                        // return this.buffer.slice(offset, offset + this.bufferSize)
                    ];
                }
            });
        });
    };
    PkgReader.prototype.close = function () {
        for (var filePart in this.parts) {
            // @ts-ignore
            if (!filePart.request) {
                continue;
            }
            // @ts-ignore
            filePart.request.close();
            // delete filePart.stream
        }
        return;
    };
    PkgReader.prototype.getSize = function () {
        return this.size;
    };
    PkgReader.prototype.getSource = function () {
        return this.source;
    };
    PkgReader.prototype.getPkgName = function () {
        return this.pkgName;
    };
    PkgReader.prototype.getBuffer = function () {
        return Buffer.from(this.buffer);
    };
    PkgReader.prototype.setupPkg = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.pkgName = this.source.pathname;
                this.multipart = false;
                this.partsCount = 1;
                this.parts.push({
                    index: 0,
                    startOfs: 0,
                    url: this.source
                });
                this.open(this.parts[0]);
                return [2 /*return*/];
            });
        });
    };
    PkgReader.prototype.setupXml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inputStream, xmlRoot, xmlElement, dp, e_1, offset, _i, _a, el, index, size, startOfs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        xmlRoot = null;
                        xmlElement = null;
                        if (!(this.source.href.startsWith('http:') || this.source.href.startsWith('https:'))) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].get(this.source.href, {
                                headers: this.headers,
                                responseType: 'text'
                            }).then(function (resp) {
                                return resp.data;
                            })];
                    case 2:
                        inputStream = _b.sent();
                        dp = new DOMParser().parseFromString(inputStream, 'application/xml');
                        xmlRoot = dp.documentElement;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        throw new Error("[INPUT] Could not open URL " + this.source.href);
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.error("File paths aren't supported.");
                        _b.label = 6;
                    case 6:
                        // let dp = new DOMParser().parseFromString(inputStream, 'application/xml')
                        // xmlRoot = dp.documentElement
                        // xmlRoot = inp
                        // Check for known XML
                        if (xmlRoot.tagName !== CONST_PKG3_XML_ROOT) {
                            throw new Error("[INPUT] Not a known PKG XML file (" + xmlRoot.tagName + " <> " + CONST_PKG3_XML_ROOT + ")");
                        }
                        // Determine values from XML data
                        xmlElement = xmlRoot.querySelector('file_name');
                        if (xmlElement) {
                            this.pkgName = xmlElement.textContent.toString();
                        }
                        xmlElement = xmlRoot.querySelector('file_size');
                        if (xmlElement) {
                            this.size = Number(xmlElement.textContent);
                        }
                        xmlElement = xmlRoot.querySelector('number_of_split_files');
                        if (xmlElement) {
                            this.partsCount = Number(xmlElement.textContent);
                            if (this.partsCount > 1) {
                                this.multipart = true;
                            }
                        }
                        offset = 0;
                        for (_i = 0, _a = xmlRoot.querySelectorAll('pieces'); _i < _a.length; _i++) {
                            el = _a[_i];
                            index = Number(el.getAttribute('index'));
                            size = Number(el.getAttribute('file_size'));
                            startOfs = offset;
                            this.parts.push({
                                index: index,
                                size: size,
                                startOfs: startOfs,
                                endOfs: startOfs + size,
                                url: new URL(this.baseUrl + el.getAttribute('url'))
                            });
                            offset += size;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PkgReader.prototype.setupJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inputStream, jsonData, e_2, count, _i, _a, piece, filePart;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inputStream = null;
                        jsonData = null;
                        if (!(this.source.href.startsWith('http:') || this.source.href.startsWith('https:'))) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].get(this.source.href, {
                                headers: this.headers,
                                responseType: 'json'
                            }).then(function (resp) {
                                return resp.data;
                            })];
                    case 2:
                        inputStream = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        throw new Error("[INPUT] Could not open URL " + this.source.href);
                    case 4:
                        jsonData = inputStream;
                        return [3 /*break*/, 6];
                    case 5:
                        console.error("File paths aren't supported.");
                        _b.label = 6;
                    case 6:
                        // Check for known JSON
                        if (!jsonData.pieces || !jsonData.pieces[0] || !jsonData.pieces[0].url) {
                            throw new Error('[INPUT] JSON source does not look like PKG meta data (missing [pieces][0])');
                        }
                        // Determine values from JSON data
                        if (jsonData.originalFileSize)
                            this.size = jsonData.originalFileSize;
                        if (jsonData.numberOfSplitFiles) {
                            this.partsCount = jsonData.numberOfSplitFiles;
                            if (this.partsCount > 1) {
                                this.multipart = true;
                            }
                        }
                        // Determine file parts from JSON data
                        if (jsonData.pieces) {
                            count = 0;
                            for (_i = 0, _a = jsonData.pieces; _i < _a.length; _i++) {
                                piece = _a[_i];
                                filePart = {
                                    url: new URL(this.baseUrl + piece.url),
                                    index: 0,
                                    startOfs: 0,
                                    endOfs: 0,
                                    size: 0
                                };
                                if (!this.pkgName) {
                                    if (filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:')) {
                                        this.pkgName = filePart.url.pathname;
                                    }
                                    else {
                                        this.pkgName = filePart.url.pathname;
                                    }
                                    this.pkgName = this.pkgName.replace(/_[0-9]+\.pkg$/, '.pkg');
                                }
                                filePart.index = count;
                                count += 1;
                                filePart.startOfs = piece.fileOffset;
                                filePart.size = piece.fileSize;
                                filePart.endOfs = filePart.startOfs + filePart.size;
                                this.parts.push(filePart);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return PkgReader;
}());
exports.PkgReader = PkgReader;
