import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios'

const CONST_PKG3_XML_ROOT = 'hfs_manifest'
const CONST_READ_SIZE = (() => {
  const min = Math.ceil(50)
  const max = Math.floor(100)
  const rand = Math.floor(Math.random() * (max - min + 1)) + min
  return rand * 0x100000
})()
const CONST_READ_AHEAD_SIZE = 128 * 0x400

const CONST_USER_AGENT_PS3 = "Mozilla/5.0 (PLAYSTATION 3; 4.84)"
// const CONST_USER_AGENT_PSP = ""
const CONST_USER_AGENT_PSV = " libhttp/3.70 (PS Vita)"
const CONST_USER_AGENT_PS4 = "Download/1.00 libhttp/6.50 (PlayStation 4)"

interface FilePart {
  index: number;
  startOfs: number;
  endOfs?: number;
  url: URL;
  request?: AxiosInstance;
  streamType?: string;
  size?: number;
}

export class PkgReader {
  public source: URL
  public pkgName: string
  public size: number
  public multipart: boolean
  public partsCount: number
  public parts: FilePart[] = []

  public buffer: Buffer
  public bufferSize: number

  public headers: object
  private baseUrl: string = 'http://proxy.nopaystation.com/'

  constructor(url: string) {
    this.source = new URL(this.baseUrl + url)
    this.pkgName = 'UNKNOWN'
    this.size = 0
    this.multipart = false
    this.partsCount = 0
    this.buffer = Buffer.from([])
    this.bufferSize = 0
    this.headers = {}

    // if (this.source.href.endsWith('.xml')) {
    //   this.setupXml()
    // } else if (this.source.href.endsWith('.json')) {
    //   console.error(".json URLs aren't implemented")
    // } else {
    //   if (this.source.href.startsWith('http:') || this.source.href.startsWith('http:')) {
    //     this.setupPkg()
    //   }
  }

  public async open(filePart: FilePart) {
    if (filePart.request) { return }

    let partSize = null

    if (filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:')) {
      filePart.request = axios.create({
        headers: this.headers,
        responseType: 'arraybuffer',
      })

      const response = await filePart.request.head(filePart.url.href)

      if (response.headers['content-length']) { partSize = response.headers['content-length'] }

      // Check file size
      if (partSize !== null) {
        if (filePart.size) {
          console.error(`[INPUT] File size differs from meta data ${partSize} <> ${filePart.size}`)
        } else {
          filePart.size = partSize
          filePart.endOfs = Number(filePart.startOfs) + Number(filePart.size)
        }
      }
    }
  }

  public async read(offset: number, size: number) {
    const result: any = []
    let readOffset = offset
    let readSize = size

    if (readSize < 0) { throw new Error('Negative read size') }

    if (this.buffer && (this.bufferSize > readOffset) && (readSize > 0)) {
      let readBufferSize = readSize
      if ((readOffset + readBufferSize) > this.bufferSize) {
        readBufferSize = this.bufferSize - readOffset
      }

      result.push(this.buffer.slice(readOffset, readOffset + readBufferSize))
      // result = Buffer.concat(result, this.buffer.slice(readOffset, readOffset + readBufferSize));

      // let b =
      // result.set(this.buffer.slice(readOffset, readOffset + readBufferSize), 0)

      // result.push() = result. (result, 0, 0, )

      readOffset += readBufferSize
      readSize -= readBufferSize
    }

    let count = 0
    let lastCount = -1

    while (readSize > 0) {
      while ((count < this.partsCount) && (this.parts[count].startOfs <= readOffset)) {
        count += 1
      }

      count -= 1

      if (lastCount === count) { throw new Error(`[INPUT] Read offset ${readOffset} out of range (max. ${this.size - 1})`) }

      lastCount = count
      const filePart: FilePart = this.parts[count]
      const fileOffset = readOffset - filePart.startOfs
      let readBufferSize = readSize

      if ((readOffset + readBufferSize) > filePart.endOfs) {
        readBufferSize = filePart.endOfs - readOffset
      }

      await this.open(filePart)

      // if (filePart.streamType === "requests") {
      //   const reqHeaders = {
      //     "Range": `bytes=${fileOffset}-${fileOffset + readBufferSize - 1}`,
      //   };

        // filePart.stream.create()

      const response = await filePart.request.get(filePart.url.href, {
        headers: {
          Range: `bytes=${fileOffset}-${fileOffset + readBufferSize - 1}`,
        },
        responseType: 'arraybuffer',
      })

      result.push(Buffer.from(response.data))
        // result =_.concat(result, response.data)
        // result. response.data, result.length)
        // result.push(response.data);
      // }

      readOffset += readBufferSize
      readSize -= readBufferSize
    }
    // return result
    // return Buffer.from(result);
    return Buffer.concat(result)

    // return this.buffer.slice(offset, offset + this.bufferSize)
  }

  public close() {
    for (const filePart in this.parts) {
      // @ts-ignore
      if (!filePart.request) {
        continue
      }
      // @ts-ignore
      filePart.request.close()
      // delete filePart.stream
    }
    return
  }

  public getSize() {
    return this.size
  }

  public getSource() {
    return this.source
  }

  public getPkgName() {
    return this.pkgName
  }

  public getBuffer() {
    return Buffer.from(this.buffer)
  }

  public async setupPkg() {
    this.pkgName = this.source.pathname

    this.multipart = false
    this.partsCount = 1

    this.parts.push({
      index: 0,
      startOfs: 0,
      url: this.source,
    })

    this.open(this.parts[0])

    // this.open(this.parts[0]).then(async () => {
    //   if (this.parts[0].size) { this.size = Number(this.parts[0].size) }
    //
    //   let readSize = CONST_READ_AHEAD_SIZE
    //
    //   if (readSize > this.size) {
    //     readSize = this.size
    //   }
    //   if (readSize > 0) {
    //     this.buffer = await this.read(0, readSize)
    //     // try {
    //     //   let req = await this.parts[0].request.get(this.source.href)
    //     //   this.buffer = req.data
    //     this.bufferSize = this.buffer.length
    //     // } catch (e) {
    //     //   throw new Error("Request Failed.")
    //     //   console.error(e)
    //     // }
    //
    //   }
    // })
  }

  public async setupXml() {
    // console.error(".xml URLs aren't implemented")
    let inputStream
    let xmlRoot: HTMLElement | any = null
    let xmlElement: HTMLElement | any = null
    if (this.source.href.startsWith('http:') || this.source.href.startsWith('https:')) {
      try {
        inputStream = await axios.get(this.source.href, {
          headers: this.headers,
          responseType: 'text',
        }).then((resp) => {
          return resp.data
        })
        let dp = new DOMParser().parseFromString(inputStream, 'application/xml')
        xmlRoot = dp.documentElement
      } catch (e) {
        throw new Error(`[INPUT] Could not open URL ${this.source.href}`)
      }
    } else {
      console.error(`File paths aren't supported.`)
    }

    // let dp = new DOMParser().parseFromString(inputStream, 'application/xml')
    // xmlRoot = dp.documentElement
    // xmlRoot = inp

    // Check for known XML
    if (xmlRoot.tagName !== CONST_PKG3_XML_ROOT) {
      throw new Error(`[INPUT] Not a known PKG XML file (${xmlRoot.tagName} <> ${CONST_PKG3_XML_ROOT})`)
    }

    // Determine values from XML data
    xmlElement = xmlRoot.querySelector('file_name')
    if (xmlElement) {
      this.pkgName = xmlElement.textContent.toString()
    }

    xmlElement = xmlRoot.querySelector('file_size')
    if (xmlElement) {
      this.size = Number(xmlElement.textContent)
    }

    xmlElement = xmlRoot.querySelector('number_of_split_files')
    if (xmlElement) {
      this.partsCount = Number(xmlElement.textContent)
      if (this.partsCount > 1) {
        this.multipart = true
      }
    }

    // Determine file parts from XML data

    let offset = 0
    for (let el of xmlRoot.querySelectorAll('pieces')) {
      let index = Number(el.getAttribute('index'))
      let size = Number(el.getAttribute('file_size'))
      let startOfs = offset
      this.parts.push({
        index,
        size,
        startOfs,
        endOfs: startOfs + size,
        url: new URL(this.baseUrl + el.getAttribute('url')),
      })

      offset += size
    }
  }

  public async setupJson() {
    // this.headers = {
    //   'User-Agent': CONST_USER_AGENT_PS4
    // }
    let inputStream = null
    let jsonData = null
    if (this.source.href.startsWith('http:') || this.source.href.startsWith('https:')) {
      try {
        inputStream = await axios.get(this.source.href, {
          headers: this.headers,
          responseType: 'json',
        }).then((resp) => {
          return resp.data
        })
      } catch (e) {
        throw new Error(`[INPUT] Could not open URL ${this.source.href}`)
      }
      jsonData = inputStream
    } else {
      console.error(`File paths aren't supported.`)
    }

    // Check for known JSON
    if (!jsonData.pieces || !jsonData.pieces[0] || !jsonData.pieces[0].url) {
      throw new Error('[INPUT] JSON source does not look like PKG meta data (missing [pieces][0])')
    }

    // Determine values from JSON data
    if (jsonData.originalFileSize) this.size = jsonData.originalFileSize

    if (jsonData.numberOfSplitFiles) {
      this.partsCount = jsonData.numberOfSplitFiles
      if (this.partsCount > 1) {
        this.multipart = true
      }
    }

    // Determine file parts from JSON data
    if (jsonData.pieces) {
      let count = 0

      for (let piece of jsonData.pieces) {
        let filePart: FilePart = {
          url: new URL(this.baseUrl + piece.url),
          index: 0,
          startOfs: 0,
          endOfs: 0,
          size: 0,
        }
        if (!this.pkgName) {
          if (filePart.url.href.startsWith('http:') || filePart.url.href.startsWith('https:')) {
            this.pkgName = filePart.url.pathname
          } else {
            this.pkgName = filePart.url.pathname
          }

          this.pkgName = this.pkgName.replace(/_[0-9]+\.pkg$/, '.pkg')
        }

        filePart.index = count
        count += 1

        filePart.startOfs = piece.fileOffset
        filePart.size = piece.fileSize

        filePart.endOfs = filePart.startOfs + filePart.size

        this.parts.push(filePart)
      }
    }
  }
}
