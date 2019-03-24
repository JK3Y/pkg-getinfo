import * as aesjs from 'aes-js'
export class PkgAesCounter {
  public key: Uint8Array
  public keySize: number = 128
  public iv: number
  public blockOffset: number = -1
  private aes: any = null

  constructor(key: Uint8Array, iv: number) {
    this.key = key
    this.iv = iv
  }

  public setOffset(offset: number) {
    if (offset === this.blockOffset) { return }

    let startCounter = this.iv
    this.blockOffset = 0
    let count = offset / 16

    if (count > 0) {
      startCounter += count
      this.blockOffset += count * 16
    }
    if (this.aes) { this.aes = null }
    let counter = new aesjs.Counter(startCounter)
    this.aes = new aesjs.ModeOfOperation.ctr(this.key, counter)
  }

  public decrypt(offset: number, data: Uint8Array) {
    this.setOffset(offset)

    this.blockOffset += data.length
    let decryptedData = this.aes.decrypt(data)
    return decryptedData
  }
}
