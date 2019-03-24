export class Slicer {
  public offset: number = 0
  public buffer: Buffer

  constructor(buffer: Buffer) {
    this.buffer = buffer
  }

  public get(size: number, fromOffset?: number) {
    if (fromOffset) {
      const endOffset = fromOffset + size
      const slice = this.buffer.slice(fromOffset, endOffset)
      this.offset = endOffset
      return slice
    }
    const slice = this.buffer.slice(this.offset, this.offset + size)
    this.offset += size
    return slice
  }

  public setOffset(offset: number) {
    this.offset = offset
  }
}
