"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var bigintbuf = require("bigint-buffer");
var PkgAesCounter = /** @class */ (function () {
    function PkgAesCounter(key, iv) {
        this.keySize = 128;
        this.blockOffset = -1;
        this.aes = null;
        this.key = key;
        this.iv = Buffer.from(iv).toString('hex');
    }
    PkgAesCounter.prototype.setOffset = function (offset) {
        if (offset === this.blockOffset) {
            return;
        }
        var startCounter = Buffer.from(this.iv, 'hex');
        this.blockOffset = 0;
        var count = offset / 16;
        if (count > 0) {
            var intval = bigintbuf.toBigIntBE(startCounter);
            startCounter = bigintbuf.toBufferBE(intval + BigInt(count), 16);
            this.blockOffset += count * 16;
        }
        if (this.aes) {
            this.aes = null;
        }
        this.aes = crypto.createCipheriv('aes-128-ctr', this.key, startCounter);
    };
    PkgAesCounter.prototype.decrypt = function (offset, data) {
        this.setOffset(offset);
        this.blockOffset += data.length;
        var decryptedData = this.aes.update(data);
        return decryptedData;
    };
    return PkgAesCounter;
}());
exports.PkgAesCounter = PkgAesCounter;
