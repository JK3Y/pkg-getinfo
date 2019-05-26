import * as crypto from 'crypto'
import * as bigintbuf from 'bigint-buffer'

export class PkgAesCounter {
  public key: Uint8Array
  public keySize: number = 128
  public iv: string
  public blockOffset: number = -1
  private aes: any = null

  constructor(key: Uint8Array, iv: Uint8Array) {
    this.key = key
    this.iv = Buffer.from(iv).toString('hex')
  }

  public setOffset(offset: number) {
    if (offset === this.blockOffset) { return }

    let startCounter = Buffer.from(this.iv, 'hex')
    this.blockOffset = 0
    let count = offset / 16

    if (count > 0) {
      let intval = bigintbuf.toBigIntBE(startCounter)
      startCounter = bigintbuf.toBufferBE(intval + BigInt(count), 16)
      this.blockOffset += count * 16
    }
    if (this.aes) { this.aes = null }
    this.aes = crypto.createCipheriv('aes-128-ctr', this.key, startCounter)
  }

  public decrypt(offset: number, data: Buffer) {
    this.setOffset(offset)
    this.blockOffset += data.length
    let decryptedData = this.aes.update(data)
    return decryptedData
  }
}
