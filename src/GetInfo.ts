import { PkgReader } from './PkgReader'
import { PkgAesCounter } from './PkgAesCounter'
import { Slicer } from './Slicer'
import { Hash, HMAC } from 'fast-sha256'
// import * as aesjs from 'aes-js'
import * as crypto from 'crypto'
import * as path from 'path'

interface AesAlign {
  ofsDelta: number;
  ofs: number;
  size: number;
  sizeDelta: number;
}
interface IPKG3ItemEntry {
  itemNameOfs: number;
  itemNameSize: number;
  dataOfs: number;
  dataSize: number;
  flags: number;
  padding1: number;
  name?: string;
  index: number;
  // keyIndex: number,
  // align: AesAlign,
  isFileOfs?: number;
}
interface IPBPItemEntry {
  dataOfs: number;
  dataSize?: number;
  name?: string;
  index: number;
  isFileOfs: number;
  align?: AesAlign;
}
class PBPItemEntry implements IPBPItemEntry {
  public dataOfs: number
  public dataSize: number
  public name: string = ''
  public index: number
  public align?: AesAlign
  public isFileOfs: number = -1

  constructor(init: IPBPItemEntry) {
    this.dataOfs = init.dataOfs
    this.dataSize = init.dataSize
    this.index = init.index

    // this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize)
  }
}
class PKG3ItemEntry implements IPKG3ItemEntry {
  public itemNameOfs: number
  public itemNameSize: number
  public dataOfs: number
  public dataSize: number
  public flags: number
  public padding1: number
  public name: string = ''
  public index: number
  public keyIndex: number
  public align: AesAlign
  public isFileOfs: number = -1

  constructor(init: IPKG3ItemEntry) {
    this.itemNameOfs = init.itemNameOfs
    this.itemNameSize = init.itemNameSize
    this.dataOfs = init.dataOfs
    this.dataSize = init.dataSize
    this.flags = init.flags
    this.padding1 = init.padding1
    this.index = init.index

    this.keyIndex = (this.flags >> 28) & 0x7
    this.align = calculateAesAlignedOffsetAndSize(this.dataOfs, this.dataSize)
  }
}

const CONST_PKG3_MAGIC = 0x7f504b47
const CONST_PKG3_HEADER_SIZE = 128
const CONST_PKG3_HEADER_EXT_SIZE = 64
const CONST_PKG3_DIGEST_SIZE = 64
const CONST_PKG3_ITEM_ENTRY_SIZE = 32
const CONST_PKG3_EXT_MAGIC = 0x7f657874
const CONST_PKG3_CONTENT_KEYS = [
  {
    key: new Uint8Array([0x2e, 0x7b, 0x71, 0xd7, 0xc9, 0xc9, 0xa1, 0x4e, 0xa3, 0x22, 0x1f, 0x18, 0x88, 0x28, 0xb8, 0xf8]),
    // key: 'Lntx18nJoU6jIh8YiCi4+A==',
    desc: 'PS3',
  },
  {
    key: new Uint8Array([0x07, 0xf2, 0xc6, 0x82, 0x90, 0xb5, 0x0d, 0x2c, 0x33, 0x81, 0x8d, 0x70, 0x9b, 0x60, 0xe6, 0x2b]),
    // key: 'B/LGgpC1DSwzgY1wm2DmKw==',
    desc: 'PSX/PSP',
  },
  {
    key: new Uint8Array([0xe3, 0x1a, 0x70, 0xc9, 0xce, 0x1d, 0xd7, 0x2b, 0xf3, 0xc0, 0x62, 0x29, 0x63, 0xf2, 0xec, 0xcb]),
    // key: '4xpwyc4d1yvzwGIpY/Lsyw==',
    desc: 'PSV',
    derive: true,
  },
  {
    key: new Uint8Array([0x42, 0x3a, 0xca, 0x3a, 0x2b, 0xd5, 0x64, 0x9f, 0x96, 0x86, 0xab, 0xad, 0x6f, 0xd8, 0x80, 0x1f]),
    // key: 'QjrKOivVZJ+Whqutb9iAHw==',
    desc: 'Unknown',
    derive: true,
  },
  {
    key: new Uint8Array([0xaf, 0x07, 0xfd, 0x59, 0x65, 0x25, 0x27, 0xba, 0xf1, 0x33, 0x89, 0x66, 0x8b, 0x17, 0xd9, 0xea]),
    // key: 'rwf9WWUlJ7rxM4lmixfZ6g==',
    desc: 'PSM',
    derive: true,
  },
]
const CONST_PKG3_UPDATE_KEYS = {
  2: {
    key: new Uint8Array([0xe5, 0xe2, 0x78, 0xaa, 0x1e, 0xe3, 0x40, 0x82, 0xa0, 0x88, 0x27, 0x9c, 0x83, 0xf9, 0xbb, 0xc8, 0x06, 0x82, 0x1c, 0x52, 0xf2, 0xab, 0x5d, 0x2b, 0x4a, 0xbd, 0x99, 0x54, 0x50, 0x35, 0x51, 0x14]),
    // key: '5eJ4qh7jQIKgiCecg/m7yAaCHFLyq10rSr2ZVFA1URQ='
    desc: 'PSV',
  },
}

const CONST_PKG4_MAIN_HEADER_SIZE = 1440
const CONST_PKG4_FILE_ENTRY_SIZE = 32
const CONST_PKG4_MAGIC = 0x7f434e54
const CONST_PKG4_FILE_ENTRY_ID_DIGEST_TABLE = 0x0001
const CONST_PKG4_FILE_ENTRY_ID_ENTRY_KEYS = 0x0010
const CONST_PKG4_FILE_ENTRY_ID_IMAGE_KEY = 0x0020
const CONST_PKG4_FILE_ENTRY_ID_GENERAL_DIGESTS = 0x0080
const CONST_PKG4_FILE_ENTRY_ID_META_TABLE = 0x0100
const CONST_PKG4_FILE_ENTRY_ID_NAME_TABLE = 0x0200
const CONST_PKG4_FILE_ENTRY_ID_PARAM_SFO = 0x1000
const CONST_PKG4_FILE_ENTRY_NAME_MAP = {
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
  0x12c0: 'pic1.dds',
}

const CONST_PARAM_SFO_MAGIC = 0x00505346
const CONST_SFO_HEADER_SIZE = 20
const CONST_SFO_INDEX_ENTRY_SIZE = 16

const CONST_PBP_HEADER_SIZE = 40
const CONST_PBP_MAGIC = 0x00504250
const CONST_REGEX_PBP_SUFFIX = /\.PBP$/iu

const CONST_PSP_PSV_RIF_SIZE = 512
const CONST_PSM_RIF_SIZE = 1024

const CONST_DATATYPE_AS_IS = 'AS-IS'
const CONST_DATATYPE_DECRYPTED = 'DECRYPTED'
const CONST_DATATYPE_UNENCRYPTED = 'UNENCRYPTED'

const CONST_CONTENT_ID_SIZE = 0x30
const CONST_SHA256_HASH_SIZE = 0x20

const CONST_READ_SIZE = (() => {
  const min = Math.ceil(50)
  const max = Math.floor(100)
  return Math.floor(Math.random() * (max - min + 1)) + min
})()
const CONST_READ_AHEAD_SIZE = 128 * 0x400

const REPLACE_LIST = [['™®☆◆', ' '], ['—–', '-']]

const enum CONST_PLATFORM {
  PS3 = 'PS3',
  PSX = 'PSX',
  PSP = 'PSP',
  PSV = 'PSV',
  PSM = 'PSM',
  PS4 = 'PS4',
}

const enum CONST_PKG_TYPE {
  GAME = 'Game',
  DLC = 'DLC',
  PATCH = 'Update',
  THEME = 'Theme',
  AVATAR = 'Avatar',
}

const enum CONST_PKG_SUB_TYPE {
  PSP_PC_ENGINE = 'PC Engine',
  PSP_GO = 'Go',
  PSP_MINI = 'PSP Mini',
  PSP_NEOGEO = 'PSP NeoGeo',
  PS2 = 'PS2 Classic',
  PSP_REMASTER = 'PSP Remaster',
}

interface IGetInfoOptions {
  baseUrl?: string;
}

export default class GetInfo {
  public reader: PkgReader
  public options: IGetInfoOptions

  constructor(options?: IGetInfoOptions) {
    this.options = options
  }

  public async pkg(url: string) {
    await this.initReader(url)

    let sfoBytes
    let pkgHeader = null
    let pkgExtHeader = null
    let pkgMetadata = null
    let pkgSfoValues = null
    let pkgItemEntries = null
    let pkgFileTable = null
    let pkgFileTableMap = null
    let itemSfoValues = null
    let pbpHeader = null
    let pbpItemEntries = null
    let pbpSfoValues = null
    let npsType = 'UNKNOWN'
    let mainSfoValues = null

    const results: any = {}

    const pkg: any = {
      headBytes: Buffer.from([]),
      tailBytes: Buffer.from([]),
    }

    try {
      pkg.headBytes = await this.reader.read(0, 4)
      this.reader.close()
    } catch (e) {
      console.error(e)
      this.reader.close()
      throw new Error(
        `Could not get PKG magic at offset 0 with size 4 from ${this.reader.getSource()}`
      )
    }

    const magic = pkg.headBytes.toString('hex')

    if (magic === CONST_PKG3_MAGIC.toString(16)) {
      pkg.itemsInfoBytes = {}
      pkg.itemBytes = {}
      pkg.headBytes = Buffer.concat([
        pkg.headBytes,
        await this.reader.read(4, CONST_PKG3_HEADER_SIZE - 4),
      ])

      let parsedHeader = await parsePkg3Header(pkg.headBytes, this.reader)
      pkgHeader = parsedHeader.pkgHeader
      pkgExtHeader = parsedHeader.pkgExtHeader
      pkgMetadata = parsedHeader.pkgMetadata
      pkg.headBytes = parsedHeader.headBytes

      if (pkgHeader.totalSize) {
        results.pkgTotalSize = parseInt(
          pkgHeader.totalSize.toString('hex'),
          16
        )
      }
      if (pkgHeader.contentId) {
        results.pkgContentId = pkgHeader.contentId
        results.pkgCidTitleId1 = pkgHeader.contentId.substring(7, 16)
        results.pkgCidTitleId2 = pkgHeader.contentId.substr(20)
      }
      if (pkgMetadata[0x0e]) {
        results.pkgSfoOffset = pkgMetadata[0x0e].ofs
        results.pkgSfoSize = pkgMetadata[0x0e].size
      }
      if (pkgMetadata[0x01]) {
        results.pkgDrmType = pkgMetadata[0x01].value
      }
      if (pkgMetadata[0x02]) {
        results.pkgContentType = pkgMetadata[0x02].value
      }
      if (pkgMetadata[0x06]) {
        results.mdTitleId = pkgMetadata[0x06].value
      }
      if (pkgMetadata[0x0d]) {
        // a) offset inside encrypted data
        if (pkgMetadata[0x0d].ofs !== 0) {
          console.error(
            `Items Info start offset inside encrypted data ${
              pkgMetadata[0x0d].ofs
            } <> 0x0.`
          )
          console.error(
            'Please report this unknown case at https://github.com/windsurfer1122/PSN_get_pkg_info'
          )
        }
        // b) size
        if (
          pkgMetadata[0x0d].size <
          pkgHeader.itemCnt * CONST_PKG3_ITEM_ENTRY_SIZE
        ) {
          console.error(
            `Items Info size ${pkgMetadata[0x0d].size} is to small for ${
              pkgHeader.itemCnt
            } Item Entries with a total size of ${pkgHeader.itemCnt *
              CONST_PKG3_ITEM_ENTRY_SIZE}.`
          )
          console.error(
            'Please report this unknown case at https://github.com/windsurfer1122/PSN_get_pkg_info'
          )
        }
      }

      if (results.pkgSfoOffset && results.pkgSfoOffset > 0) {
        sfoBytes = await retrieveParamSfo(pkg, results, this.reader)
        // const sfoMagic = sfoBytes.readUInt32BE(0)
        // const sfoMagic = buf2Int(sfoBytes.slice(0, 4), 16)
        // if (sfoMagic !== CONST_PARAM_SFO_MAGIC) {
        //   this.reader.close()
        //   throw new Error(`Not a known PARAM.SFO structure`)
        // }
        if (sfoBytes) {
          // Check for known PARAM.SFO data
          checkSfoMagic(sfoBytes.slice(0, 4), this.reader)
          // Process PARAM.SFO data
          pkgSfoValues = await parseSfo(sfoBytes)
        }
      }

      // Process PKG3 encrypted item entries
      if (pkgHeader.keyIndex !== null) {
        let parsedItems = await parsePkg3ItemsInfo(
          pkgHeader,
          pkgMetadata,
          this.reader
        )
        pkg.itemsInfoBytes = parsedItems.itemsInfoBytes
        pkgItemEntries = parsedItems.pkgItemEntries
        results.itemsInfo = Object.assign({}, pkg.itemsInfoBytes)
        if (results.itemsInfo[CONST_DATATYPE_AS_IS]) {
          delete results.itemsInfo[CONST_DATATYPE_AS_IS]
        }
        if (results.itemsInfo[CONST_DATATYPE_DECRYPTED]) {
          delete results.itemsInfo[CONST_DATATYPE_DECRYPTED]
        }
      }

      if (pkgItemEntries !== null) {
        // Search PARAM.SFO in encrypted data
        let retrieveEncryptedParamSfo = false
        if (pkgHeader.paramSfo) {
          retrieveEncryptedParamSfo = true
        }

        for (let itemEntry of pkgItemEntries) {
          if (!itemEntry.name || itemEntry.dataSize <= 0) {
            continue
          }

          let itemIndex = itemEntry.index

          if (
            retrieveEncryptedParamSfo &&
            itemEntry.name === pkgHeader.paramSfo
          ) {
            console.debug(`>>>>> ${itemEntry.name} (from encrypted data)`)

            // Retrieve PARAM.SFO
            pkg.itemBytes[itemIndex] = {}
            pkg.itemBytes[itemIndex].add = true
            await processPkg3Item(
              pkgHeader,
              itemEntry,
              this.reader,
              pkg.itemBytes[itemIndex]
            )

            // Process PARAM.SFO
            sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(
              itemEntry.align.ofsDelta,
              itemEntry.align.ofsDelta + itemEntry.dataSize
            )

            // Check for known PARAM.SFO data
            checkSfoMagic(sfoBytes.slice(0, 4), this.reader)

            // Process PARAM.SFO data
            itemSfoValues = await parseSfo(sfoBytes)
          } else if (CONST_REGEX_PBP_SUFFIX.test(itemEntry.name)) {
            // Retrieve PBP header
            pkg.itemBytes[itemIndex] = {}
            pkg.itemBytes[itemIndex].add = true
            await processPkg3Item(
              pkgHeader,
              itemEntry,
              this.reader,
              pkg.itemBytes[itemIndex],
              Math.min(2048, itemEntry.dataSize)
            )

            // Process PBP header
            let pbpBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(
              itemEntry.align.ofsDelta,
              itemEntry.align.ofsDelta + CONST_PBP_HEADER_SIZE
            )

            let parsedPBP = await parsePbpHeader(pbpBytes, itemEntry.dataSize)
            pbpHeader = parsedPBP.pbpHeaderFields
            pbpItemEntries = parsedPBP.itemEntries

            await processPkg3Item(
              pkgHeader,
              itemEntry,
              this.reader,
              pkg.itemBytes[itemIndex],
              pbpHeader.iconPngOfs
            )

            // Process PARAM.SFO
            sfoBytes = pkg.itemBytes[itemIndex][CONST_DATATYPE_DECRYPTED].slice(
              itemEntry.align.ofsDelta + pbpItemEntries[0].dataOfs,
              itemEntry.align.ofsDelta +
                pbpItemEntries[0].dataOfs +
                pbpItemEntries[0].dataSize
            )

            // Check for known PARAM.SFO data
            checkSfoMagic(sfoBytes.slice(0, 4), this.reader)

            // Process PARAM.SFO data
            pbpSfoValues = await parseSfo(sfoBytes)
          }
        }
      }

      if (pkgSfoValues === null && itemSfoValues !== null) {
        pkgSfoValues = itemSfoValues
        itemSfoValues = null
      }
      mainSfoValues = pkgSfoValues

      // Get PKG3 unencrypted tail data
      try {
        pkg.tailBytes = await this.reader.read(
          pkgHeader.dataOfs + pkgHeader.dataSize,
          pkgHeader.totalSize - (pkgHeader.dataOfs + pkgHeader.dataSize)
        )
      } catch (e) {
        this.reader.close()
        console.error(
          `Could not get PKG3 unencrypted tail at offset ${pkgHeader.dataOfs +
            pkgHeader.dataSize} size ${pkgHeader.totalSize -
            (pkgHeader.dataOfs +
              pkgHeader.dataSize)} from ${this.reader.getSource()}`
        )
      }

      if (pkg.tailBytes) {
        // may not be present or have failed, e.g. when analyzing a head.bin file, a broken download or only the first file of a multi-part package
        results.pkgTailSize = pkg.tailBytes.length
        results.pkgTailSha1 = pkg.tailBytes.slice(
          -0x20,
          pkg.tailBytes.length - 0x0c
        )
      }
    } else if (magic === CONST_PKG4_MAGIC.toString(16)) {
      // PS4
      console.error('PS4 support not yet added.')
    } else if (magic === CONST_PBP_MAGIC.toString(16)) {
      // PBP
      let parsedPbpHeader = await parsePbpHeader(
        pkg.headBytes,
        results.fileSize,
        this.reader
      )
      pbpHeader = parsedPbpHeader.pbpHeaderFields
      pbpItemEntries = parsedPbpHeader.itemEntries

      // PARAM.SFO offset + size
      if (pbpItemEntries.length >= 1 && pbpItemEntries[0].dataSize > 0) {
        results.pkgSfoOffset = pbpItemEntries[0].dataOfs
        results.pkgSfoSize = pbpItemEntries[0].dataSize

        // Retrieve PBP PARAM.SFO from unencrypted data
        sfoBytes = await retrieveParamSfo(pkg, results, this.reader)

        // Process PARAM.SFO if present
        if (sfoBytes) {
          // Check for known PARAM.SFO data
          checkSfoMagic(sfoBytes.slice(0, 4), this.reader)

          // Process PARAM.SFO data
          pbpSfoValues = await parseSfo(sfoBytes)

          console.log('pbpSfoValues')
          console.log(pbpSfoValues)
        }

        mainSfoValues = pbpSfoValues
      }
    }

    if (results.pkgContentId) {
      results.contentId = results.pkgContentId
      results.cidTitleId1 = results.contentId.substring(7, 16)
      results.cidTitleId2 = results.contentId.substring(20)
      results.titleId = results.cidTitleId1
    }

    if (results.mdTitleId) {
      if (!results.titleId) {
        results.titleId = results.mdTitleId
      }
      if (results.cidTitleId1 && results.mdTitleId !== results.cidTitleId1) {
        results.mdTidDiffer = true
      }
    }

    // Process main PARAM.SFO if present
    if (mainSfoValues) {
      console.debug('mainSfoValues')
      console.debug(mainSfoValues)

      if (mainSfoValues.DISK_ID) {
        results.sfoTitleId = mainSfoValues.DISK_ID
      }
      if (mainSfoValues.TITLE_ID) {
        results.sfoTitleId = mainSfoValues.TITLE_ID
        if (
          results.pkgCidTitleId1 &&
          mainSfoValues.TITLE_ID !== results.pkgCidTitleId1
        ) {
          results.sfoPkgTidDiffer = true
        }
      }

      if (mainSfoValues.CONTENT_ID) {
        results.sfoContentId = mainSfoValues.CONTENT_ID
        results.sfoCidTitleId1 = results.sfoContentId.substring(7, 16)
        results.sfoCidTitleId2 = results.sfoContentId.substring(20)
        if (
          results.pkgContentId &&
          mainSfoValues.CONTENT_ID !== results.pkgContentId
        ) {
          results.sfoCidDiffer = true
        }
        if (
          mainSfoValues.TITLE_ID &&
          mainSfoValues.TITLE_ID !== results.sfoCidTitleId1
        ) {
          results.sfoTidDiffer = true
        }
      }

      if (mainSfoValues.CATEGORY) {
        results.sfoCategory = mainSfoValues.CATEGORY
      }

      if (mainSfoValues.PUBTOOLINFO) {
        try {
          results.sfoCreationDate = mainSfoValues.PUBTOOLINFO.substring(7, 15)
          results.sfoSdkVer =
            Number(mainSfoValues.PUBTOOLINFO.substring(24, 32)) / 1000000
        } catch (e) {
          console.error(e)
        }
      }

      if (!results.titleId && results.sfoTitleId) {
        results.titleId = results.sfoTitleId
      }

      if (!results.contentId && results.sfoContentId) {
        results.contentId = results.sfoContentId
        results.cidTitleId1 = results.contentId.substring(7, 16)
        results.cidTitleId2 = results.contentId.substring(20)
        if (!results.titleId) {
          results.titleId = results.cidTitleId1
        }
      }
    }

    // Determine some derived variables
    // a) Region and related languages
    if (results.contentId) {
      let r = getRegion(results.contentId[0])
      results.region = r.region
      results.languages = r.languages
      // if (results.languages === null) {
        // results.languages
      // TODO: line 2831/2832
      // }
    }

    // b) International/English title
    for (let language of ['01', '18']) {
      let key = 'TITLE_'.concat(language)
      if (mainSfoValues && mainSfoValues[key]) {
        results.sfoTitle = mainSfoValues[key]
      }
    }

    if (!results.sfoTitle && mainSfoValues && mainSfoValues.TITLE) {
      results.sfoTitle = mainSfoValues.TITLE
    }

    // Clean international/english title
    if (results.sfoTitle) {
      if (REPLACE_LIST) {
        for (let replaceChars of REPLACE_LIST) {
          for (let i = 0; i < replaceChars[0].length; i++) {
            let replaceChar = replaceChars[0][i]
            if (replaceChars[1] === ' ') {
              results.sfoTitle = results.sfoTitle.replace(
                replaceChar.concat(':'),
                ':'
              )
            }
            results.sfoTitle = results.sfoTitle.replace(
              replaceChar,
              replaceChars[1]
            )
          }
        }
      }
      results.sfoTitle = results.sfoTitle.replace(/\s+/u, ' ') // also replaces \u3000
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
        .replace('体験版', '(DEMO)')
      results.sfoTitle = results.sfoTitle.replace(/(demo)/iu, '(DEMO)')
      results.sfoTitle = results.sfoTitle.replace(
        /(^|[^a-z(]{1})demo([^a-z)]{1}|$)/iu,
        '$1(DEMO)$2'
      )

      results.sfoTitle = results.sfoTitle.replace(/(  )/iu, ' ')
    }

    // c) Regional title
    if (results.languages) {
      for (let language of results.languages) {
        let key = 'TITLE_'.concat(language)
        if (mainSfoValues && mainSfoValues[key]) {
          results.sfoTitleRegional = mainSfoValues[key]
          break
        }
      }
    }

    if (!results.sfoTitleRegional && mainSfoValues && mainSfoValues.title) {
      results.sfoTitleRegional = mainSfoValues.title
    }

    // Clean regional title
    if (results.sfoTitleRegional) {
      if (REPLACE_LIST) {
        for (let replaceChars of REPLACE_LIST) {
          for (let i = 0; i < replaceChars[0].length; i++) {
            let replaceChar = replaceChars[0][i]
            if (replaceChars[1] === ' ') {
              results.sfoTitleRegional = results.sfoTitleRegional.replace(
                replaceChar.concat(':'),
                ':'
              )
            }
            results.sfoTitleRegional = results.sfoTitleRegional.replace(
              replaceChar,
              replaceChars[1]
            )
          }
        }
      }
      results.sfoTitleRegional = results.sfoTitleRegional.replace(/\s+/u, ' ') // also replaces \u3000
    }

    // d) Determine platform and package type
    // TODO: Further complete determination (e.g. PS4 content types)
    if (magic === CONST_PKG3_MAGIC.toString(16)) {
      if (results.pkgContentType) {
        // PS3 packages
        if (results.pkgContentType === 0x4 || results.pkgContentType === 0xb) {
          results.platform = CONST_PLATFORM.PS3
          if (pkgMetadata[0x0b]) {
            results.pkgType = CONST_PKG_TYPE.PATCH
            npsType = 'PS3 UPDATE'
          } else {
            results.pkgType = CONST_PKG_TYPE.DLC
            npsType = 'PS3 DLC'

            if (!results.sfoTitle && pkgMetadata[0x03] && pkgMetadata[0x03].value === 0x0000048c) {
              for (let itemEntry of pkgItemEntries) {
                if (!itemEntry.name || itemEntry.dataSize <= 0) {
                  continue
                }

                if (itemEntry.name.endsWith('.edat') && !itemEntry.name.endsWith('p3t.edat')) {
                  results.sfoTitle = `${results.titleId} - Unlock Key`
                  break
                }
              }
            }
          }

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)

          if (results.titleId) {
            results.titleUpdateUrl = `https://a0.ww.np.dl.playstation.net/tpl/np/${
              results.titleId
            }/${results.titleId}-ver.xml`
          }
        } else if (
          results.pkgContentType === 0x5 ||
          results.pkgContentType === 0x13 ||
          results.pkgContentType === 0x14
        ) {
          results.platform = CONST_PLATFORM.PS3
          results.pkgType = CONST_PKG_TYPE.GAME
          if (results.pkgContentType === 0x14) {
            results.pkgSubType = CONST_PKG_SUB_TYPE.PSP_REMASTER
          }

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
          npsType = 'PS3 GAME'

          if (results.titleId) {
            results.titleUpdateUrl = `https://a0.ww.np.dl.playstation.net/tpl/np/${
              results.titleId
            }/${results.titleId}-ver.xml`
          }
        } else if (results.pkgContentType === 0x9) {
          // PS3/PSP Themes
          results.platform = CONST_PLATFORM.PS3
          results.pkgType = CONST_PKG_TYPE.THEME
          npsType = 'PS3 THEME'

          if (
            pkgMetadata[0x03] &&
            buf2Int(pkgMetadata[0x03].value) === 0x0000020c
          ) {
            results.platform = CONST_PLATFORM.PSP
            npsType = 'PSP THEME'
          }

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
        } else if (results.pkgContentType === 0xd) {
          results.platform = CONST_PLATFORM.PS3
          results.pkgType = CONST_PKG_TYPE.AVATAR

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
          npsType = 'PS3 AVATAR'
        } else if (results.pkgContentType === 0x12) {
          // PS2/SFO_CATEGORY = 2P
          results.platform = CONST_PLATFORM.PS3
          results.pkgType = CONST_PKG_TYPE.GAME
          results.pkgSubType = CONST_PKG_SUB_TYPE.PS2

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
          npsType = 'PS3 GAME'

          if (results.sfoTitleId) {
            results.Ps2TitleId = results.sfoTitleId
          }
        } else if (
          results.pkgContentType === 0x1 ||
          results.pkgContentType === 0x6
        ) {
          // PSX packages
          results.platform = CONST_PLATFORM.PSX
          results.pkgType = CONST_PKG_TYPE.GAME

          results.pkgExtractRootUx0 = path.join(
            'pspemu',
            'PSP',
            'GAME',
            results.pkgCidTitleId1
          )
          results.pkgExtractLicUx0 = path.join(
            'pspemu',
            'PSP',
            'LICENSE',
            ''.concat(results.pkgContentId, '.rif')
          )

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
          npsType = 'PSX GAME'

          // Special Case: PCSC80018 "Pocketstation for PS Vita"
          if (results.titleId === 'PCSC80018') {
            results.platform = CONST_PLATFORM.PSV
            results.pkgSubType = CONST_PLATFORM.PSX
            results.pkgExtractRootUx0 = path.join(
              'ps1emu',
              results.pkgCidTitleId1
            )
            npsType = 'PSV GAME'
          }

          if (results.pkgContentType === 0x6 && results.mdTitleId) {
            results.psxTitleId = results.mdTitleId
          }
        } else if (
          results.pkgContentType === 0x7 ||
          results.pkgContentType === 0xe ||
          results.pkgContentType === 0xf ||
          results.pkgContentType === 0x10
        ) {
          results.platform = CONST_PLATFORM.PSP
          if (pbpSfoValues && pbpSfoValues.category) {
            if (pbpSfoValues.category === 'PG') {
              results.pkgType = CONST_PKG_TYPE.PATCH
              npsType = 'PSP UPDATE'
            } else if (pbpSfoValues.category === 'MG') {
              results.pkgType = CONST_PKG_TYPE.DLC
              npsType = 'PSP DLC'
            }
          }

          if (!results.pkgType) {
            // Normally CATEGORY === EG
            results.pkgType = CONST_PKG_TYPE.GAME
            npsType = 'PSP GAME'
          }

          // TODO: Verify when ISO and when GAME directory has to be used?
          results.pkgExtractRootUx0 = path.join(
            'pspemu',
            'PSP',
            'GAME',
            results.pkgCidTitleId1
          )
          results.pkgExtractIsorUx0 = path.join('pspemu', 'ISO')
          results.pkgExtractIsoName = `${results.sfoTitle} [${results.pkgCidTitleId1}].iso`
          // results.pkgExtractIsoName = ''.concat(results.sfoTitle, ' [', results.pkgCidTitleId1, ']', '.iso')

          if (results.pkgContentType === 0x7) {
            if (results.sfoCategory === 'HG') {
              results.pkgSubType = CONST_PKG_SUB_TYPE.PSP_PC_ENGINE
            }
          } else if (results.pkgContentType === 0xe) {
            results.pkgSubType = CONST_PKG_SUB_TYPE.PSP_GO
          } else if (results.pkgContentType === 0xf) {
            results.pkgSubType = CONST_PKG_SUB_TYPE.PSP_MINI
          } else if (results.pkgContentType === 0x10) {
            results.pkgSubType = CONST_PKG_SUB_TYPE.PSP_NEOGEO
          }

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)

          if (results.titleId) {
            results.titleUpdateUrl = `https://a0.ww.np.dl.playstation.net/tpl/np/${
              results.titleId
            }/${results.titleId}-ver.xml`
          }
        } else if (results.pkgContentType === 0x15) {
          // PSV packages
          results.platform = CONST_PLATFORM.PSV
          if (results.sfoCategory && results.sfoCategory === 'gp') {
            results.pkgType = CONST_PKG_TYPE.PATCH
            results.pkgExtractRootUx0 = path.join('patch', results.cidTitleId1)
            npsType = 'PSV UPDATE'
          } else {
            results.pkgType = CONST_PKG_TYPE.GAME
            results.pkgExtractRootUx0 = path.join('app', results.cidTitleId1)
            npsType = 'PSV GAME'
          }

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)

          if (results.titleId) {
            let updateHash = new HMAC(CONST_PKG3_UPDATE_KEYS[2].key)
            let data = new TextEncoder().encode(`np_${results.titleId}`)
            updateHash.update(data)
            results.titleUpdateUrl = `http://gs-sec.ww.np.dl.playstation.net/pl/np/${
              results.titleId
            }/${toHexString(updateHash.digest())}/${results.titleId}-ver.xml`
          }
        } else if (results.pkgContentType === 0x16) {
          results.platform = CONST_PLATFORM.PSV
          results.pkgType = CONST_PKG_TYPE.DLC

          results.pkgExtractRootUx0 = path.join(
            'addcont',
            results.cidTitleId1,
            results.cidTitleId2
          )
          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)

          npsType = 'PSV DLC'

          if (results.titleId) {
            let updateHash = new HMAC(CONST_PKG3_UPDATE_KEYS[2].key)
            let data = new TextEncoder().encode(`np_${results.titleId}`)
            updateHash.update(data)
            results.titleUpdateUrl = `http://gs-sec.ww.np.dl.playstation.net/pl/np/${
              results.titleId
            }/${toHexString(updateHash.digest())}/${results.titleId}-ver.xml`
          }
        } else if (results.pkgContentType === 0x1f) {
          results.platform = CONST_PLATFORM.PSV
          results.pkgType = CONST_PKG_TYPE.THEME

          results.pkgExtractRootUx0 = path.join(
            'theme',
            `${results.cidTitleId1}-${results.cidTitleId2}`
          )

          // TODO/FUTURE: bgdl
          //  - find next free xxxxxxxx dir (hex 00000000-FFFFFFFF)
          //    Note that Vita has issues with handling more than 32 bgdls at once
          //  - package sub dir is Results["PKG_CID_TITLE_ID1"] for Game/DLC/Theme
          //  - create additional d0/d1.pdb and temp.dat files in root dir for Game/Theme
          //  - create additional f0.pdb for DLC
          // Results["PKG_EXTRACT_ROOT_UX0"] = os.path.join("bgdl", "t", "xxxxxx")
          // , )))

          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
          npsType = 'PSV THEME'
        } else if (
          results.pkgContentType === 0x18 ||
          results.pkgContentType === 0x1d
        ) {
          results.platform = CONST_PLATFORM.PSM
          results.pkgType = CONST_PKG_TYPE.GAME

          results.pkgExtractRootUx0 = path.join('psm', results.cidTitleId1)
          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)

          npsType = 'PSM GAME'
        } else {
          // Unknown packages
          console.error(`PKG content type ${results.pkgContentType}.`)
          results.pkgExtractRootCont = pkgHeader.contentId.substring(7)
        }
      }
    } else if (magic === CONST_PKG4_MAGIC.toString(16)) {
      results.platform = CONST_PLATFORM.PS4
      if (results.pkgContentType === 0x1a) {
        if (results.sfoCategory && results.sfoCategory === 'gd') {
          results.pkgType = CONST_PKG_TYPE.GAME
          npsType = 'PS4 GAME'
        } else if (results.sfoCategory && results.sfoCategory === 'gp') {
          results.pkgType = CONST_PKG_TYPE.PATCH
          npsType = 'PS4 UPDATE'
        }
      } else if (results.pkgContentType === 0x1b) {
        if (results.sfoCategory && results.sfoCategory === 'ac') {
          results.pkgType = CONST_PKG_TYPE.DLC
          npsType = 'PS4 DLC'
        }
      }
    } else if (magic === CONST_PBP_MAGIC.toString(16)) {
      // PBP
      // TODO
      results.pkgExtractRootCont = results.titleId
    }

    results.npsType = npsType

    // e) Media/App/Firmware Version
    let sfoValues = null
    for (sfoValues in [pbpSfoValues, itemSfoValues, pkgSfoValues]) {
      if (!sfoValues) { continue }
      // Media Version
      if (!results.sfoVersion && sfoValues.discVersion) {
        results.sfoVersion = parseFloat(sfoValues.discVersion)
      }
      if (!results.sfoVersion && sfoValues.version) {
        results.sfoVersion = parseFloat(sfoValues.version)
      }

      // Application Version
      if (!results.sfoAppVer && sfoValues.appVer) {
        results.sfoAppVer = parseFloat(sfoValues.appVer)
      }

      // Firmware PS3
      if (!results.sfoMinVerPs3 && sfoValues.ps3SystemVer) {
        results.sfoMinVerPs3 = parseFloat(sfoValues.ps3SystemVer)
      }

      // Firmware PSP
      if (!results.sfoMinVerPsp && sfoValues.pspSystemVer) {
        results.sfoMinVerPsp = parseFloat(sfoValues.pspSystemVer)
      }

      // Firmware PS Vita
      if (!results.sfoMinVerPsv && sfoValues.psp2DispVer) {
        results.sfoMinVerPsv = parseFloat(sfoValues.psp2DispVer)
      }

      // Firmware PS4
      if (!results.sfoMinVerPs4 && sfoValues.systemVer) {
        results.sfoMinVerPs4 = `${(sfoValues.systemVer >> 24) &
          0xff}.${(sfoValues.systemVer >> 16) & 0xff}`
      }
    }

    if (!results.sfoAppVer) {
      results.sfoAppVer = 0x0 // mandatory value
    }

    results.sfoMinVer = 0.0 // mandatory value
    if (results.platform) {
      if (results.platform === CONST_PLATFORM.PS3) {
        if (results.sfoMinVerPs3) {
          results.sfoMinVer = results.sfoMinVerPs3
        }
      } else if (results.platform === CONST_PLATFORM.PSP) {
        if (results.sfoMinVerPsp) {
          results.sfoMinVer = results.sfoMinVerPsp
        }
      } else if (results.platform === CONST_PLATFORM.PSV) {
        if (results.sfoMinVerPsv) {
          results.sfoMinVer = results.sfoMinVerPsv
        }
      } else if (results.platform === CONST_PLATFORM.PS4) {
        if (results.sfoMinVerPs4) {
          results.sfoMinVer = results.sfoMinVerPs4
        }
      }
    }

    // Output Results
    let jsonOutput: any = {}
    jsonOutput.debug = {
      pkgHeader,
      pkgSfoValues,
      pkgExtHeader,
      pkgItemEntries,
      pkgMetadata,
      itemSfoValues,
      pbpHeader,
      pbpItemEntries,
      pbpSfoValues,
      mainSfoValues,
      npsType,
      results,
      pkg,
    }
    jsonOutput.results = {}
    jsonOutput.results.source = this.reader.getSource().href
    if (results.titleId) { jsonOutput.results.titleId = results.titleId }
    if (results.sfoTitle) { jsonOutput.results.title = results.sfoTitle }
    if (results.sfoTitleRegional) {
      jsonOutput.results.regionalTitle = results.sfoTitleRegional
    }
    if (results.contentId) { jsonOutput.results.region = results.region }
    if (results.sfoMinVer !== null) {
      jsonOutput.results.minFw = results.sfoMinVer
    }
    if (results.sfoMinVerPs3 !== null && results.sfoMinVerPs3 >= 0) {
      jsonOutput.results.minFwPs3 = results.sfoMinVerPs3
    }
    if (results.sfoMinVerPsp !== null && results.sfoMinVerPsp >= 0) {
      jsonOutput.results.minFwPsp = results.sfoMinVerPsp
    }
    if (results.sfoMinVerPsv !== null && results.sfoMinVerPsv >= 0) {
      jsonOutput.results.minFwPsv = results.sfoMinVerPsv
    }
    if (results.sfoMinVerPs4 !== null && results.sfoMinVerPs4 >= 0) {
      jsonOutput.results.minFwPs4 = results.sfoMinVerPs4
    }
    if (results.sfoSdkVer !== null && results.sfoSdkVer >= 0) {
      jsonOutput.results.sdkVer = results.sfoSdkVer
    }
    if (results.sfoCreationDate) {
      jsonOutput.results.creationDate = results.sfoCreationDate
    }
    if (results.sfoVersion !== null && results.sfoVersion >= 0) {
      jsonOutput.results.version = results.sfoVersion
    }
    if (results.sfoAppVer !== null && results.sfoAppVer >= 0) {
      jsonOutput.results.appVer = results.sfoAppVer
    }
    if (results.psxTitleId) { jsonOutput.results.psxTitleId = results.psxTitleId }
    if (results.contentId) { jsonOutput.results.contentId = results.contentId }
    if (results.pkgTotalSize && results.pkgTotalSize > 0) {
      jsonOutput.results.pkgTotalSize = results.pkgTotalSize
      jsonOutput.results.prettySize = humanFileSize(results.pkgTotalSize)
    }
    if (results.fileSize) { jsonOutput.results.fileSize = results.fileSize }
    if (results.titleUpdateUrl) {
      jsonOutput.results.titleUpdateUrl = results.titleUpdateUrl
    }
    jsonOutput.results.npsType = results.npsType
    if (results.platform) { jsonOutput.results.pkgPlatform = results.platform }
    if (results.pkgType) { jsonOutput.results.pkgType = results.pkgType }
    if (results.pkgSubType) { jsonOutput.results.pkgSubType = results.pkgSubType }

    if (results.toolVersion) {
      jsonOutput.results.toolVersion = results.toolVersion
    }
    if (results.pkgContentId) {
      jsonOutput.results.pkgContentId = results.pkgContentId
      jsonOutput.results.pkgCidTitleId1 = results.pkgCidTitleId1
      jsonOutput.results.pkgCidTitleId2 = results.pkgCidTitleId2
    }
    if (results.mdTitleId) {
      jsonOutput.results.mdTitleId = results.mdTitleId
      if (results.mdTidDiffer) {
        jsonOutput.results.mdTidDiffer = results.mdTidDiffer
      }
    }
    if (results.pkgSfoOffset) {
      jsonOutput.results.pkgSfoOffset = results.pkgSfoOffset
    }
    if (results.pkgSfoOffset) {
      jsonOutput.results.pkgSfoSize = results.pkgSfoSize
    }
    if (results.pkgDrmType) { jsonOutput.results.pkgDrmType = results.pkgDrmType }
    if (results.pkgContentType) {
      jsonOutput.results.pkgContentType = results.pkgContentType
    }
    if (results.pkgTailSize) {
      jsonOutput.results.pkgTailSize = results.pkgTailSize
    }
    if (results.pkgTailSha1) {
      jsonOutput.results.pkgTailSha1 = results.pkgTailSha1
    }
    if (results.itemsInfo) {
      jsonOutput.results.itemsInfo = results.itemsInfo
      if (jsonOutput.results.itemsInfo.align) {
        delete jsonOutput.results.itemsInfo.align
      }
    }
    if (results.sfoTitleId) { jsonOutput.results.sfoTitleId = results.sfoTitleId }
    if (results.sfoCategory) {
      jsonOutput.results.sfoCategory = results.sfoCategory
    }
    if (results.sfoContentId) {
      jsonOutput.results.sfoContentId = results.sfoContentId
      jsonOutput.results.sfoCidTitleId1 = results.sfoCidTitleId1
      jsonOutput.results.sfoCidTitleId2 = results.sfoCidTitleId2
      if (results.sfoCidDiffer) {
        jsonOutput.results.sfoCidDiffer = results.sfoCidDiffer
      }
      if (results.sfoTidDiffer) {
        jsonOutput.results.sfoTidDiffer = results.sfoTidDiffer
      }
    }

    return jsonOutput
  }

  private async initReader(url: string) {
    if (this.options.baseUrl) {
      if (!this.options.baseUrl.endsWith('/')) {
        this.options.baseUrl += '/'
      }

      this.reader = new PkgReader(url, this.options.baseUrl)
    } else {
      this.reader = new PkgReader(url)
    }

    if (url.endsWith('.xml')) {
      await this.reader.setupXml()
    } else if (url.endsWith('.json')) {
      await this.reader.setupJson()
    } else {
      if (url.startsWith('http:') || url.startsWith('http:')) {
        await this.reader.setupPkg()
      }
    }
  }
}

async function parsePkg3Header(dataBuffer: Buffer, reader: PkgReader) {
  let offset = 0

  function get(size: number, fromOffset?: number) {
    let slice
    if (fromOffset) {
      slice = dataBuffer.slice(fromOffset, fromOffset + size)
      offset = fromOffset + size
      return slice
    }
    slice = dataBuffer.slice(offset, offset + size)
    offset += size
    return slice
  }

  // let slicer = new Slicer(dataBuffer)

  /*
    Retrieve PKG3 data from Header
   */
  // let headerFields: any = {
  //   magic: slicer.get(0x04),
  //   rev: slicer.get(0x02),
  //   type: buf2Int(slicer.get(0x02), 4),
  //   mdOfs: buf2Int(slicer.get(0x04), 16),
  //   mdCnt: buf2Int(slicer.get(0x04), 16),
  //   hdrSize: slicer.get(0x04),
  //   itemCnt: buf2Int(slicer.get(0x04), 16),
  //   totalSize: slicer.get(0x08),
  //   dataOfs: buf2Int(slicer.get(0x08), 16),
  //   dataSize: buf2Int(slicer.get(0x08), 16),
  //   contentId: slicer.get(0x24).toString(),
  //   padding: slicer.get(0x0c),
  //   digest: buf2hex(slicer.get(0x10)),
  //   dataRiv: slicer.get(0x10),
  //   keyType: dataBuffer[0xe7] & 7,
  //   keyIndex: null,
  //   mdSize: 0,
  //   paramSfo: '',
  //   aesCtr: {},
  // }
  let headerFields: any = {
    magic: get(0x04),
    rev: get(0x02),
    type: buf2Int(get(0x02), 4),
    mdOfs: buf2Int(get(0x04), 16),
    mdCnt: buf2Int(get(0x04), 16),
    hdrSize: get(0x04),
    itemCnt: buf2Int(get(0x04), 16),
    totalSize: get(0x08),
    dataOfs: buf2Int(get(0x08), 16),
    dataSize: buf2Int(get(0x08), 16),
    contentId: get(0x24).toString(),
    padding: get(0x0c),
    digest: buf2hex(get(0x10)),
    dataRiv: get(0x10),
    keyType: dataBuffer[0xe7] & 7,
    keyIndex: null,
    mdSize: 0,
    paramSfo: '',
    aesCtr: {},
  }

  // Retrieve PKG3 Unencrypted Data from input stream
  const readSize = headerFields.dataOfs - CONST_PKG3_HEADER_SIZE

  console.debug(
    `Get PKG3 remaining unencrypted data with size ${readSize}/${
      headerFields.dataOfs
    }`
  )

  let unencryptedBytes = dataBuffer

  try {
    unencryptedBytes = Buffer.concat([
      dataBuffer,
      await reader.read(CONST_PKG3_HEADER_SIZE, readSize),
    ])
  } catch (e) {
    reader.close()
    throw new Error(
      `Could not get PKG3 unencrypted data at offset ${CONST_PKG3_HEADER_SIZE} with size ${readSize} from ${reader.getSource()}`
    )
  }

  /*
    Retrieve PKG3 Extended Header data from Header
   */
  let slicerExt = new Slicer(unencryptedBytes)
  let extHeaderFields = null
  const mainHdrSize = CONST_PKG3_HEADER_SIZE + CONST_PKG3_DIGEST_SIZE

  if (headerFields.type === 0x2) {
    console.debug('>>>>> PKG3 Extended Main Header:')

    const magic = slicerExt.get(0x04, mainHdrSize)

    if (magic.readInt32BE(0) !== CONST_PKG3_EXT_MAGIC) {
      reader.close()
      throw new Error('Not a known PKG3 Extended Main Header')
      console.error('Not a known PKG3 Extended Main Header')
    }

    extHeaderFields = {
      magic,
      unknown1: slicerExt.get(0x04),
      extHeaderSize: slicerExt.get(0x04),
      extDataSize: slicerExt.get(0x04),
      mainAndExtHeadersHmacOffset: slicerExt.get(0x04),
      metadataHeaderHmacOffset: slicerExt.get(0x04),
      tailOffset: slicerExt.get(0x08),
      padding1: slicerExt.get(0x04),
      pkgKeyId: buf2Int(slicerExt.get(0x04), 16),
      fullHeaderHmacOffset: slicerExt.get(0x04),
      padding2: slicerExt.get(0x02),
    }
  }

  /*
    Determine key index for item entries plus path of PARAM.SFO
   */
  console.debug('>>>>> PKG3 Package Keys:')

  if (headerFields.type === 0x1) {
    // PS3
    headerFields.keyIndex = 0
    headerFields.paramSfo = 'PARAM.SFO'
  } else if (headerFields.type === 0x2) {
    // PSX/PSP/PSV/PSM
    headerFields.paramSfo = 'PARAM.SFO'
    if (extHeaderFields) {
      headerFields.keyIndex = extHeaderFields.pkgKeyId & 0xf
      if (headerFields.keyIndex === 2) {
        // PSV
        headerFields.paramSfo = 'sce_sys/param.sfo'
      } else if (headerFields.keyIndex === 3) {
        // Unknown
        console.error(`[UNKNOWN] PKG3 Key Index ${headerFields.type}`)
      }
    } else {
      headerFields.keyIndex = 1
    }
  } else {
    console.error(`[UNKNOWN] PKG3 Package Type ${headerFields.type}`)
  }

  for (let key in CONST_PKG3_CONTENT_KEYS) {
    console.debug(
      `Content Key #${key}: ${toHexString(CONST_PKG3_CONTENT_KEYS[key].key)}`
    )

    if (CONST_PKG3_CONTENT_KEYS[key].derive) {
      let aesEcb = crypto.createCipheriv(
        'aes-128-ecb',
        CONST_PKG3_CONTENT_KEYS[key].key,
        ''
      )
      let pkgKey = aesEcb.update(headerFields.dataRiv)

      headerFields.aesCtr[key] = new PkgAesCounter(
        pkgKey,
        headerFields.dataRiv
      )

      console.debug(
        `Derived Key #${key} from IV encrypted with Content Key: ${toHexString(
          pkgKey
        )}`
      )
    } else {
      headerFields.aesCtr[key] = new PkgAesCounter(
        CONST_PKG3_CONTENT_KEYS[key].key,
        headerFields.dataRiv
      )
    }
  }

  /*
    Extract fields from PKG3 Main Header Meta Data
    */
  console.debug('>>>>> PKG3 Meta Data:')

  let metadata: any = {}
  let mdEntryType = -1
  let mdEntrySize = -1
  let mdOffset = headerFields.mdOfs

  for (let i = 0; i < headerFields.mdCnt; i++) {
    mdEntryType = unencryptedBytes.slice(mdOffset, mdOffset + 4).readInt32BE(0)

    mdOffset += 4

    mdEntrySize = unencryptedBytes.slice(mdOffset, mdOffset + 4).readInt32BE(0)

    mdOffset += 4

    // let tempBytes = dataBuffer.slice(mdOffset, mdOffset + mdEntrySize)
    let tempBytes = unencryptedBytes.slice(mdOffset, mdOffset + mdEntrySize)

    console.debug(
      `Metadata[${i}]: [0x${mdOffset
        .toString(16)
        .toUpperCase()}| ${mdEntrySize}] ID ${mdEntryType} = ${buf2hex(
        tempBytes
      )}`
    )

    metadata[mdEntryType] = {}

    // (1) DRM Type
    // (2) Content Type
    if (mdEntryType === 0x01 || mdEntryType === 0x02) {
      if (mdEntryType === 0x01) {
        metadata[mdEntryType].desc = 'DRM Type'
      } else if (mdEntryType === 0x02) {
        metadata[mdEntryType].desc = 'Content Type'
      }
      metadata[mdEntryType].value = tempBytes.readInt32BE(0)

      if (mdEntrySize > 0x04) {
        metadata[mdEntryType].unknown = tempBytes.slice(0x04)
      }
    }
    // (6) Title ID (when size 0xC) (otherwise Version + App Version)
    else if (mdEntryType === 0x06 && mdEntrySize === 0x0c) {
      if (mdEntryType === 0x06) {
        metadata[mdEntryType].desc = 'Title ID'
      }
      metadata[mdEntryType].value = tempBytes.toString()
    }
    // (10) Install Directory
    else if (mdEntryType === 0x0a) {
      if (mdEntryType === 0x0a) {
        metadata[mdEntryType].desc = 'Install Directory'
      }
      metadata[mdEntryType].unknown = tempBytes.slice(0, 0x8)
      metadata[mdEntryType].value = tempBytes.slice(0x8).toString()
    }
    // (13) Items Info (PS Vita)
    else if (mdEntryType === 0x0d) {
      if (mdEntryType === 0x0d) {
        metadata[mdEntryType].desc = 'Items Info (SHA256 of decrypted data)'
      }
      metadata[mdEntryType].ofs = tempBytes.readInt32BE(0)
      metadata[mdEntryType].size = tempBytes.readInt32BE(0x04)
      metadata[mdEntryType].sha256 = buf2hex(
        tempBytes.slice(0x08, 0x08 + 0x20)
      )

      if (mdEntrySize > 0x28) {
        metadata[mdEntryType].unknown = tempBytes.slice(0x28)
      }
    }
    // (14) PARAM.SFO Info (PS Vita)
    // (15) Unknown Info (PS Vita)
    // (16) Entirety Info (PS Vita)
    // (18) Self Info (PS Vita)
    else if (
      mdEntryType === 0x0e ||
      mdEntryType === 0x0f ||
      mdEntryType === 0x10 ||
      mdEntryType === 0x12
    ) {
      if (mdEntryType === 0x0e) {
        metadata[mdEntryType].desc = 'PARAM.SFO Info'
      } else if (mdEntryType === 0x10) {
        metadata[mdEntryType].desc = 'Entirety Info'
      } else if (mdEntryType === 0x12) {
        metadata[mdEntryType].desc = 'Self Info'
      }
      metadata[mdEntryType].ofs = tempBytes.readInt32BE(0)
      metadata[mdEntryType].size = tempBytes.readInt32BE(0x04)

      if (mdEntryType === 0x0e) {
        metadata[mdEntryType].unknown1 = tempBytes.slice(0x08, 0x08 + 4)
        metadata[mdEntryType].firmware = tempBytes.slice(0x0c, 0x0c + 4)
        metadata[mdEntryType].unknown2 = tempBytes.slice(
          0x10,
          mdEntrySize - 0x20
        )
      } else {
        metadata[mdEntryType].unknown = tempBytes.slice(
          0x08,
          mdEntrySize - 0x20
        )
      }
      metadata[mdEntryType].sha256 = buf2hex(
        tempBytes.slice(mdEntrySize - 0x20)
      )
    } else {
      if (mdEntryType === 0x03) {
        metadata[mdEntryType].desc = 'Package Type/Flags'
      } else if (mdEntryType === 0x04) {
        metadata[mdEntryType].desc = 'Package Size'
      } else if (mdEntryType === 0x06) {
        metadata[mdEntryType].desc = 'Version + App Version'
      } else if (mdEntryType === 0x07) {
        metadata[mdEntryType].desc = 'QA Digest'
      }
      metadata[mdEntryType].value = tempBytes
    }

    // // Unknown element found; seen in PSP cumulative patch
    // if (type.readInt32BE(0) === 0xB) { // 11
    //   metadataFields.type0B = true
    // }

    // PARAM.SFO offset and size element found
    // if (type.readInt32BE(0) === 0xE) { // 14
    //   metadataFields.sfoOffset = unencryptedBytes.slice(mdOffset + 8, mdOffset + 12);
    //   metadataFields.sfoSize = unencryptedBytes.slice(mdOffset + 12, mdOffset + 16)
    // }

    mdOffset += mdEntrySize
  }

  // headerFields.hdrSize = mdOffset - headerFields.mdOfs
  headerFields.mdSize = mdOffset - headerFields.mdOfs

  return {
    pkgHeader: headerFields,
    pkgExtHeader: extHeaderFields,
    pkgMetadata: metadata,
    headBytes: unencryptedBytes,
  }
}

async function retrieveParamSfo(pkg, results, reader: PkgReader) {
  console.debug('>>>>> PARAM.SFO (from unencrypted data):')
  console.debug(
    `Get PARAM.SFO from unencrypted data with offset ${toHexString(
      results.pkgSfoOffset
    )} with size ${results.pkgSfoSize}`
  )

  let sfoBytes: Uint8Array
  if (pkg.headBytes.length >= results.pkgSfoOffset + results.pkgSfoSize) {
    console.debug('from head data')

    sfoBytes = pkg.headBytes.slice(
      results.pkgSfoOffset,
      results.pkgSfoOffset + results.pkgSfoSize
    )
  } else {
    console.debug('from input stream')

    try {
      sfoBytes = await reader.read(results.pkgSfoOffset, results.pkgSfoSize)
    } catch (e) {
      reader.close()
      throw new Error(
        `Could not get PARAM.SFO at offset ${toHexString(
          results.pkgSfoOffset
        )} with size ${results.pkgSfoSize} from ${reader.getSource()}`
      )
    }
  }

  return sfoBytes
}

function checkSfoMagic(sfoMagic, reader: PkgReader) {
  if (buf2Int(sfoMagic, 16) !== CONST_PARAM_SFO_MAGIC) {
    reader.close()
    throw new Error(
      `Not a known PARAM.SFO structure (${toHexString(
        sfoMagic
      )} <> ${CONST_PARAM_SFO_MAGIC})`
    )
  }
  return
}

async function parseSfo(sfoBytes: Buffer) {
  console.debug('>>>>> SFO Header:')

  sfoBytes = Buffer.from(sfoBytes)
  let sfoKeyTableStart = sfoBytes.readInt32LE(0x08)
  let sfoDataTableStart = sfoBytes.readInt32LE(0x0c)
  let sfoTableEntries = sfoBytes.readInt32LE(0x10)
  let sfoValues: any = {}

  for (let i = 0; i < sfoTableEntries; i++) {
    let sfoIndexEntryOfs = 0x14 + i * 0x10
    let sfoIndexKeyOfs =
      sfoKeyTableStart + sfoBytes.readInt16LE(sfoIndexEntryOfs)
    let sfoIndexKey = ''
    let charArr = sfoBytes.slice(sfoIndexKeyOfs).toString()

    for (let j = 0; j < charArr.length; j++) {
      if (charArr.charAt(j) === '\u0000') {
        break
      }
      sfoIndexKey += charArr.charAt(j)
    }
    // for (let char in charArr) {
    //   if (String.fromCharCode(char) === '\u0000') break
    //   sfoIndexKey += String.fromCharCode(char)
    // }

    let sfoIndexKeyName = sfoIndexKey.toString()
    let sfoIndexDataOfs =
      sfoDataTableStart + sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x0c)
    let sfoIndexDataFmt = sfoBytes.readInt16LE(sfoIndexEntryOfs + 0x02)
    let sfoIndexDataLen = sfoBytes.readInt32LE(sfoIndexEntryOfs + 0x04)
    let sfoIndexData = sfoBytes.slice(
      sfoIndexDataOfs,
      sfoIndexDataOfs + sfoIndexDataLen
    )

    let value

    if (sfoIndexDataFmt === 0x0004 || sfoIndexDataFmt === 0x0204) {
      // if (sfoIndexDataFmt === 0x0204) {
      //
      // }
      value = sfoIndexData.toString()

      if (
        sfoIndexKeyName === 'STITLE' || sfoIndexKeyName.substring(0, 7) === 'STITLE_' || sfoIndexKeyName === 'TITLE' || (sfoIndexKeyName.substring(0, 6) === 'TITLE_' && sfoIndexKeyName !== 'TITLE_ID')
      ) {
        value = value.replace('\r\n', ' ').replace('\n\r', ' ')
        value = value.replace('\0', '')
        value = value.replace(/\s/u, ' ')
      }
    } else if (sfoIndexDataFmt === 0x0404) {
      value = sfoIndexData.readInt32LE(0)
    }

    sfoValues[sfoIndexKeyName] = value

    // offset += CONST_SFO_INDEX_ENTRY_SIZE
  }
  return sfoValues
}

function calculateAesAlignedOffsetAndSize(
  offset: number,
  size: number
): AesAlign {
  let align: AesAlign | any = {}
  // Decrement AES block size (16)
  align.ofsDelta = offset & (0x10 - 1)
  align.ofs = offset - align.ofsDelta

  align.sizeDelta = (align.ofsDelta + size) & (0x10 - 1)
  if (align.sizeDelta > 0) {
    align.sizeDelta = 0x10 - align.sizeDelta
  }
  align.sizeDelta += align.ofsDelta
  align.size = size + align.sizeDelta

  return align
}

async function parsePkg3ItemsInfo(headerFields, metaData, reader: PkgReader) {
  console.debug('>>>>> PKG3 Body Items Info:')

  let itemsInfoBytes: any = {}
  itemsInfoBytes.ofs = 0
  itemsInfoBytes.size = headerFields.itemCnt * CONST_PKG3_ITEM_ENTRY_SIZE
  itemsInfoBytes.align = {}
  itemsInfoBytes.entriesSize =
    headerFields.itemCnt * CONST_PKG3_ITEM_ENTRY_SIZE

  if (metaData[0x0d]) {
    itemsInfoBytes.ofs = metaData[0x0d].ofs
    if (itemsInfoBytes.size < metaData[0x0d].size) {
      itemsInfoBytes.size = metaData[0x0d].size
    }
  }

  itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(
    itemsInfoBytes.ofs,
    itemsInfoBytes.size
  )

  console.debug(
    `Get PKG3 Items Info/Item Entries from encrypted data with offset ${
      itemsInfoBytes.ofs
    } - ${itemsInfoBytes.align.ofsDelta} + ${
      headerFields.dataOfs
    } = ${headerFields.dataOfs + itemsInfoBytes.align.ofs} with count ${
      headerFields.itemCnt
    } and size ${itemsInfoBytes.size} + ${itemsInfoBytes.align.sizeDelta} = ${
      itemsInfoBytes.align.size
    }`
  )

  if (itemsInfoBytes.align.ofsDelta > 0) {
    console.error(`Unaligned encrypted offset \
    ${itemsInfoBytes.ofs} - ${itemsInfoBytes.align.ofsDelta} = \
    ${itemsInfoBytes.align.ofs} (+ ${
      headerFields.dataOfs
    }) for Items Info/Items Entries.`)
  }

  itemsInfoBytes[CONST_DATATYPE_AS_IS] = []
  try {
    itemsInfoBytes[CONST_DATATYPE_AS_IS] = await reader.read(
      headerFields.dataOfs + itemsInfoBytes.align.ofs,
      itemsInfoBytes.align.size
    )
  } catch (e) {
    reader.close()
    throw new Error(`Could not get PKG3 encrypted data at \
    offset ${headerFields.dataOfs + itemsInfoBytes.align.ofs} with \
    size ${itemsInfoBytes.align.size} from ${reader.getSource()}`)
  }

  // Decrypt PKG3 Item Entries
  itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = headerFields.aesCtr[headerFields.keyIndex
].decrypt(itemsInfoBytes.align.ofs, itemsInfoBytes[CONST_DATATYPE_AS_IS])

  // Parse PKG3 Item Entries
  let pkgItemEntries = []
  let offset = itemsInfoBytes.align.ofsDelta
  itemsInfoBytes.namesOfs = null
  let nameOffsetEnd = null
  let itemNameSizeMax = 0

  let slicer: Slicer = new Slicer(itemsInfoBytes[CONST_DATATYPE_DECRYPTED])
  for (let i = 0; i < headerFields.itemCnt; i++) {
    let tempFields: PKG3ItemEntry = new PKG3ItemEntry({
      itemNameOfs: buf2Int(slicer.get(0x4), 16),
      itemNameSize: buf2Int(slicer.get(0x4), 16),
      dataOfs: buf2Int(slicer.get(0x8), 16),
      dataSize: buf2Int(slicer.get(0x8), 16),
      flags: buf2Int(slicer.get(0x4), 16),
      padding1: buf2Int(slicer.get(0x4), 16),
      index: i,
    })

    if (tempFields.align.ofsDelta > 0) {
      console.error(
        `Unaligned encrypted offset ${tempFields.dataOfs} - ${
          tempFields.align.ofsDelta
        } = ${tempFields.align.ofs} (+${headerFields.dataOfs})`
      )
    }

    let itemFlags = tempFields.flags & 0xff
    if (itemFlags === 0x4 || itemFlags === 0x12) {
      // directory
      tempFields.isFileOfs = -1
    } else {
      tempFields.isFileOfs = tempFields.dataOfs
    }

    pkgItemEntries.push(tempFields)

    if (tempFields.itemNameSize > 0) {
      if (
        itemsInfoBytes.namesOfs === null ||
        tempFields.itemNameOfs < itemsInfoBytes.namesOfs
      ) {
        itemsInfoBytes.namesOfs = tempFields.itemNameOfs
      }

      if (nameOffsetEnd === null || tempFields.itemNameOfs >= nameOffsetEnd) {
        nameOffsetEnd = tempFields.itemNameOfs + tempFields.itemNameSize
      }

      if (tempFields.itemNameSize > itemNameSizeMax) {
        itemNameSizeMax = tempFields.itemNameSize
      }
    }

    offset += CONST_PKG3_ITEM_ENTRY_SIZE
  }

  itemsInfoBytes.namesSize = nameOffsetEnd - itemsInfoBytes.namesOfs

  // Check if Item Names follow immediately after Item Entries (relative offsets inside Items Info)
  if (itemsInfoBytes.namesOfs < itemsInfoBytes.entriesSize) {
    console.error(
      `Item Names with offset ${
        itemsInfoBytes.namesOfs
      } are INTERLEAVED with the Item Entries of size ${
        itemsInfoBytes.entriesSize
      }.`
    )
    console.error(
      'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
    )
  } else if (itemsInfoBytes.namesOfs > itemsInfoBytes.entriesSize) {
    console.error(
      `Item Names with offset ${
        itemsInfoBytes.namesOfs
      } are not directly following the Item Entries with size ${
        itemsInfoBytes.entriesSize
      }`
    )
    console.error(
      'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
    )
  }

  // Retrieve PKG3 remaining Items Info data (if any) for Item Names from input stream
  // Calculate complete size via first relative name offset inside Items Info plus names size
  let readSize = itemsInfoBytes.namesOfs + itemsInfoBytes.namesSize
  if (readSize > itemsInfoBytes.size) {
    if (metaData[0x0d] && metaData[0x0d].size >= itemsInfoBytes.entriesSize) {
      // meta data size too small for whole Items Info
      console.error(
        `Items Info size ${
          metaData[0x0d].size
        } from meta data 0x0D is too small for complete Items Info (Entries+Names) with total size of ${readSize}`
      )
      console.error(
        'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
      )
    }
    itemsInfoBytes.size = readSize
    itemsInfoBytes.align = calculateAesAlignedOffsetAndSize(
      itemsInfoBytes.ofs,
      itemsInfoBytes.size
    )
    let readOffset =
      itemsInfoBytes.align.ofs + itemsInfoBytes[CONST_DATATYPE_AS_IS].length
    readSize =
      itemsInfoBytes.align.size - itemsInfoBytes[CONST_DATATYPE_AS_IS].length

    console.debug(
      `Get PKG3 remaining Items Info/Item Names data with size ${readSize}/${
        itemsInfoBytes.align.size
      } `
    )

    try {
      itemsInfoBytes[CONST_DATATYPE_AS_IS] = Buffer.concat([
        Buffer.from(itemsInfoBytes[CONST_DATATYPE_AS_IS]),
        await reader.read(headerFields.dataOfs + readOffset, readSize),
      ])
    } catch (e) {
      reader.close()
      throw new Error(
        `Could not get PKG3 encrypted data at offset ${headerFields.dataOfs +
          readOffset} with size ${readSize} from ${reader.getSource()}`
      )
    }

    itemsInfoBytes[CONST_DATATYPE_DECRYPTED] = Buffer.concat([
      Buffer.from(itemsInfoBytes[CONST_DATATYPE_DECRYPTED]),
      itemsInfoBytes[CONST_DATATYPE_AS_IS].slice(
        itemsInfoBytes[CONST_DATATYPE_DECRYPTED].length
      ),
    ])
  } else {
    if (metaData[0x0d]) {
      let align = calculateAesAlignedOffsetAndSize(
        itemsInfoBytes.ofs,
        readSize
      )
      if (align.size !== metaData[0x0d].size) {
        console.error(
          `Determined aligned Items Info size ${align.size} <> ${
            metaData[0x0d].size
          } from meta data 0x0D.`
        )
        console.error(
          'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
        )
      }
    }
  }

  // Decrypt and Parse PKG3 Item Names
  for (let itemEntry of pkgItemEntries) {
    if (itemEntry.itemNameSize <= 0) {
      continue
    }
    let keyIndex = itemEntry.keyIndex
    offset = itemsInfoBytes.ofs + itemEntry.itemNameOfs
    let align = calculateAesAlignedOffsetAndSize(
      offset,
      itemEntry.itemNameSize
    )
    if (align.ofsDelta > 0) {
      console.error(
        `Unaligned encrypted offset ${offset} - ${align.ofsDelta} = ${
          align.ofs
        } (+ ${headerFields.dataOfs}) for ${itemEntry.index} item name.`
      )
      console.error(
        'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
      )
    }

    offset = align.ofs - itemsInfoBytes.align.ofs

    let enc = itemsInfoBytes[CONST_DATATYPE_AS_IS].slice(
      offset,
      offset + align.size
    )
    let dec = headerFields.aesCtr[keyIndex].decrypt(align.ofs, enc)
    Buffer.from(dec).copy(itemsInfoBytes[CONST_DATATYPE_DECRYPTED], offset)

    let tempBytes = itemsInfoBytes[CONST_DATATYPE_DECRYPTED].slice(
      offset + align.ofsDelta,
      offset + align.ofsDelta + itemEntry.itemNameSize
    )

    itemEntry.name = buf2Str(tempBytes)

    console.debug(`PKG3 Body Item Name: ${itemEntry.name}`)
  }

  let hasher = new Hash()
  hasher.update(itemsInfoBytes[CONST_DATATYPE_DECRYPTED])

  itemsInfoBytes.sha256 = buf2hex(hasher.digest())

  if (
    metaData[0x0d] &&
    buf2hex(itemsInfoBytes.sha256) !== buf2hex(metaData[0x0d].sha256)
  ) {
    console.error(
      'Calculated SHA-256 of decrypted Items Info does not match the one from meta data 0x0D.'
    )
    console.error(`${itemsInfoBytes.sha256} <> ${metaData[0x0d].sha256}`)
    console.error(
      'Please report this issue at https://github.com/windsurfer1122/PSN_get_pkg_info'
    )
  }

  // Further analysys data
  itemsInfoBytes.fileOfs = headerFields.dataOfs + itemsInfoBytes.ofs
  itemsInfoBytes.fileOfsEnd = itemsInfoBytes.fileOfs + itemsInfoBytes.size

  return { itemsInfoBytes, pkgItemEntries }
}

async function processPkg3Item(
  extractionsFields,
  itemEntry: PKG3ItemEntry,
  reader: PkgReader,
  itemData,
  size: any = null,
  extractions = null
) {
  console.debug(
    `>>>>> PKG3 Body Item Entry #${itemEntry.index} ${itemEntry.name}:`
  )

  // Prepare dictionaries
  let itemDataUsable = 0
  let addItemData = false
  if (itemData !== null) {
    if (itemData.add) {
      addItemData = true

      if (!itemData[CONST_DATATYPE_AS_IS]) {
        itemData[CONST_DATATYPE_AS_IS] = []
      }
      if (!itemData[CONST_DATATYPE_DECRYPTED]) {
        itemData[CONST_DATATYPE_DECRYPTED] = []
      }
    }

    if (itemData[CONST_DATATYPE_AS_IS]) {
      itemDataUsable = itemData[CONST_DATATYPE_AS_IS].length
    }
  }

  if (extractions) {
    for (let key in extractions) {
      let extract = extractions[key]
      extract.itemBytesWritten = 0
    }
  }

  // Retrieve PKG3 Item Data from input stream
  let align = null
  if (size === null) {
    size = itemEntry.dataSize
    align = itemEntry.align
  } else {
    align = calculateAesAlignedOffsetAndSize(itemEntry.dataOfs, size)
  }

  console.debug(
    `Get PKG3 item data from encrypted data with offset ${
      itemEntry.dataOfs
    } - ${align.ofsDelta} + ${
      extractionsFields.dataOfs
    } = ${extractionsFields.dataOfs + align.ofs} and size ${size} + {} = {}{}`
  )

  let dataOffset = align.ofs
  let fileOffset = extractionsFields.dataOfs + dataOffset
  let restSize = align.size

  let encryptedBytes = null
  let decryptedBytes = null
  let blockDataOfs = align.ofsDelta
  let blockDataSizeDelta = 0
  let blockSize = null
  while (restSize > 0) {
    // Calculate next data block
    if (itemDataUsable > 0) {
      blockSize = itemDataUsable
    } else {
      blockSize = restSize
      // blockSize = Math.min(restSize, CONST_READ_SIZE)
    }

    if (restSize <= blockSize) {
      // final block
      blockDataSizeDelta = align.sizeDelta - align.ofsDelta
    }

    let blockDataSize = blockSize - blockDataOfs - blockDataSizeDelta

    // Get and process encrypted data block
    if (itemDataUsable > 0) {
      encryptedBytes = itemData[CONST_DATATYPE_AS_IS]
    } else {
      // Read encrypted data block
      try {
        encryptedBytes = await reader.read(fileOffset, blockSize)
      } catch (e) {
        reader.close()
        throw new Error(
          `Could not get PKG3 encrypted data at offset ${extractionsFields.dataOfs +
            align.ofs} with size ${align.size} from ${reader.getSource()}`
        )
      }

      if (addItemData) {
        itemData[CONST_DATATYPE_AS_IS] = encryptedBytes
      }
    }

    // Get and process decrypted block
    if (
      itemEntry.hasOwnProperty('keyIndex') &&
      extractionsFields.hasOwnProperty('aesCtr')
    ) {
      console.debug('inside decrypted')

      if (itemDataUsable > 0) {
        decryptedBytes = itemData[CONST_DATATYPE_DECRYPTED]
      } else {
        decryptedBytes = extractionsFields.aesCtr[itemEntry.keyIndex].decrypt(
          dataOffset,
          encryptedBytes
        )

        if (addItemData) {
          itemData[CONST_DATATYPE_DECRYPTED] = decryptedBytes
        }
      }
    }

    // Write extractions
    if (extractions) {
      for (let key in extractions) {
        let extract = extractions[key]

        // console.debug(extract)
        if (!extract.request) {
          continue
        }

        let writeBytes = null
        if (extract.itemDataType === CONST_DATATYPE_AS_IS) {
          writeBytes = encryptedBytes
        } else if (extract.itemDataType === CONST_DATATYPE_DECRYPTED) {
          writeBytes = decryptedBytes
        } else {
          continue
          // TODO: error handling
        }

        if (extract.aligned) {
          // extract.itemBytesWritten += extract.request.write
          // todo: ln 2073
        } else {
          // extract.itemBytesWritten += extract.request.write
          // todo: ln 2075
        }
      }
    }

    // Prepare for next data block
    restSize -= blockSize
    fileOffset += blockSize
    dataOffset += blockSize
    blockDataOfs = 0
    itemDataUsable = 0
  }

  // Clean up extractions
  if (extractions) {
    for (let key in extractions) {
      let extract = extractions[key]
      if (extract.request) {
        extract.bytesWritten += extract.itemBytesWritten
      }
    }
  }

  return itemData
}

async function parsePbpHeader(
  headBytes: Buffer,
  fileSize: number,
  reader?: PkgReader
) {
  // For definition see http://www.psdevwiki.com/ps3/Eboot.PBP
  // Extract fields from PBP header
  let slicer = new Slicer(headBytes)
  let pbpHeaderFields: any = {
    magic: slicer.get(0x04),
    version: slicer.get(0x04),
    paramSfoOfs: slicer.get(0x04),
    icon0PngOfs: slicer.get(0x04),
    icon1PmfOfs: slicer.get(0x04),
    pic0PngOfs: slicer.get(0x04),
    pic1PngOfs: slicer.get(0x04),
    snd0At3Ofs: slicer.get(0x04),
    dataPspOfs: slicer.get(0x04),
    dataPsarOfs: slicer.get(0x04),
  }

  console.debug(pbpHeaderFields)

  // Retrieve PKG3 Unencrypted Data from input stream
  let unencryptedBytes = new Uint8Array([])
  if (reader) {
    let readSize = pbpHeaderFields.icon0PngOfs - CONST_PBP_HEADER_SIZE
    unencryptedBytes = headBytes

    try {
      unencryptedBytes = Buffer.concat([
        unencryptedBytes,
        await reader.read(CONST_PBP_HEADER_SIZE, readSize),
      ])
    } catch (e) {
      reader.close()
      throw new Error(
        `Could not get PBP unencrypted data at offset ${CONST_PBP_HEADER_SIZE} with size ${readSize} from ${reader.getSource()}`
      )
    }
  }

  // Determine key index for data
  // TODO

  // Build item entries
  let itemEntries = []
  let itemIndex: number = 0
  let lastItem: number = 0

  for (let key in pbpHeaderFields) {
    let itemEntry = new PBPItemEntry({
      index: itemIndex,
      dataOfs: pbpHeaderFields[key],
      isFileOfs: pbpHeaderFields[key],
    })

    if (lastItem) {
      itemEntries[lastItem].dataSize =
        itemEntry.dataOfs - itemEntries[lastItem].dataOfs
      itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(
        itemEntries[lastItem].dataOfs,
        itemEntries[lastItem].dataSize
      )
    }

    lastItem = itemIndex

    if (key === 'paramSfoOfs') {
      itemEntry.name = 'PARAM.SFO'
    } else if (key === 'icon0PngOfs') {
      itemEntry.name = 'ICON0.PNG'
    } else if (key === 'icon1PmfOfs') {
      itemEntry.name = 'ICON1.PMF'
    } else if (key === 'pic0PngOfs') {
      itemEntry.name = 'PIC0.PNG'
    } else if (key === 'pic1PngOfs') {
      itemEntry.name = 'PIC1.PNG'
    } else if (key === 'snd0At3Ofs') {
      itemEntry.name = 'SND0.AT3'
    } else if (key === 'dataPspOfs') {
      itemEntry.name = 'DATA.PSP'
    } else if (key === 'dataPsarOfs') {
      itemEntry.name = 'DATA.PSAR'
    }

    itemEntries.push(itemEntry)

    itemIndex += 1
  }

  if (lastItem) {
    itemEntries[lastItem].dataSize = fileSize - itemEntries[lastItem].dataOfs
    itemEntries[lastItem].align = calculateAesAlignedOffsetAndSize(
      itemEntries[lastItem].dataOfs,
      itemEntries[lastItem].dataSize
    )
  }

  return { pbpHeaderFields, itemEntries }
}

function getRegion(id: string) {
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
      return { region: 'ASIA', languages: ['09', '11', '10', '00'] }
    case 'E':
      return { region: 'EU', languages: ['01', '18'] }
    case 'H':
      return { region: 'ASIA(HKG)', languages: ['11', '10'] }
    case 'I':
      return { region: 'INT', languages: ['01', '18'] }
    case 'J':
      return { region: 'JP', languages: ['00'] }
    case 'K':
      return { region: 'ASIA(KOR)', languages: ['09'] }
    case 'U':
      return { region: 'US', languages: ['01'] }
    default:
      return { region: '???', languages: null }
  }
}

function buf2hex(buffer: Uint8Array) {
  let s = ''
  let h = '0123456789ABCDEF'
  new Uint8Array(buffer).forEach((v: number) => {
    s += h[v >> 4] + h[v & 15]
  })
  return s
}

function buf2Int(bytes: Buffer, radix: number = 16) {
  return parseInt(buf2hex(bytes), radix)
}

function buf2Str(bytes: ArrayBuffer) {
  let str = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return str
}

function toHexString(byteArray: ArrayBuffer) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).toUpperCase().slice(-2)
    })
    .join('')
}

function humanFileSize(bytes, si = false) {
  let thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }
  let units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return `${bytes.toFixed(1)} ${units[u]}`
}

function splice(arr, starting, deleteCount, elements) {
  if (arguments.length === 1) {
    return arr
  }
  starting = Math.max(starting, 0)
  deleteCount = Math.max(deleteCount, 0)
  elements = elements || []

  const newSize = arr.length - deleteCount + elements.length
  const splicedArray = new arr.constructor(newSize)

  splicedArray.set(arr.subarray(0, starting))
  splicedArray.set(elements, starting)
  splicedArray.set(
    arr.subarray(starting + deleteCount),
    starting + elements.length
  )
  return splicedArray
}
