"use strict";
exports.__esModule = true;
var aesjs = require("aes-js");
var PkgAesCounter = /** @class */ (function () {
    function PkgAesCounter(key, iv) {
        this.keySize = 128;
        this.blockOffset = -1;
        this.aes = null;
        this.key = key;
        this.iv = iv;
    }
    PkgAesCounter.prototype.setOffset = function (offset) {
        if (offset === this.blockOffset) {
            return;
        }
        var startCounter = this.iv;
        this.blockOffset = 0;
        var count = offset / 16;
        if (count > 0) {
            startCounter += count;
            this.blockOffset += count * 16;
        }
        if (this.aes) {
            this.aes = null;
        }
        var counter = new aesjs.Counter(startCounter);
        this.aes = new aesjs.ModeOfOperation.ctr(this.key, counter);
    };
    PkgAesCounter.prototype.decrypt = function (offset, data) {
        this.setOffset(offset);
        this.blockOffset += data.length;
        var decryptedData = this.aes.decrypt(data);
        return decryptedData;
    };
    return PkgAesCounter;
}());
exports.PkgAesCounter = PkgAesCounter;
