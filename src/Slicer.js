"use strict";
exports.__esModule = true;
var Slicer = /** @class */ (function () {
    function Slicer(buffer) {
        this.offset = 0;
        this.buffer = buffer;
    }
    Slicer.prototype.get = function (size, fromOffset) {
        if (fromOffset) {
            var endOffset = fromOffset + size;
            var slice_1 = this.buffer.slice(fromOffset, endOffset);
            this.offset = endOffset;
            return slice_1;
        }
        var slice = this.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return slice;
    };
    Slicer.prototype.setOffset = function (offset) {
        this.offset = offset;
    };
    return Slicer;
}());
exports.Slicer = Slicer;
