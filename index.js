// let gi = require('./src/getinfo.js')
//
// gi.getinfo()

const fetch = require('node-fetch');
const Headers = fetch.Headers;
const binary = require('binary')

const range = require('range').range

/**
 * Getinfo Function
 *
 * @param {string} url Absolute url to pkg
 * @return void
 */
exports.getinfo = (url) => {
    // let url = "http://zeus.dl.playstation.net/cdn/UP9000/PCSA00001_00/eMylfKGUWSacpFJvIunKkOGpgWquRbkHqLWcmOYGwNNkBwOUOnybfIUNNKgsnWliuAEopLbxEHCtkNgAvbstqnMOdxlvvQTFbOKnC.pkg"

    // let url = 'http://zeus.dl.playstation.net/cdn/UP0001/NPUB30162_00/bG751I62Aych0U2E7hsxD5vKS28NurYg8CmJln6oQV4LUDAfXGSOyQHE45reFxIuwD5Qjo1xnQleHqulmmx9HmjNnXX8P5O5jcXlD.pkg'

    requestData(url)
        .then(getHeader)
        .then(parseSFO)
        .then(function(data) {
            console.log(data)
        })
}

function requestData(url) {
    const headers = new Headers({
        'Range': 'bytes=0-10000'
    })

    const opts = {
        headers: headers
    }

    return fetch(url, opts)
        .then(res => res.buffer())
}

function getRegion(id) {
    switch(id) {
        case 'U':
            return 'US'
        case 'E':
            return 'EU'
        case 'J':
            return 'JP'
        case 'K':
            return 'ASIA(KOR)'
        case 'H':
            return 'ASIA(HKG)'
        case 'I':
            return 'INT'
        default:
            return '???'
    }
}



function parseSFO(header) {
    let sfo = header.sfo

    let parsedSFO = {
        total_size: header.total_size,
        content_id: '',
        drm_type: header.drm_type,
        content_type: header.content_type,
        type_0A: typeof header.type_0A === 'boolean',
        type_0B: typeof header.type_0B === 'boolean',
        type: "UNKNOWN",
        psx_title_id: "",
        title_id: "",
        title: "",
        region: "",
        min_ver: -0.01,
        category: "",
        app_ver: -0.01,
        sdk_ver: -0.01,
        c_date: ""
    }
    parsedSFO.title_id = header.title_id
    parsedSFO.file_size = header.total_size
    setContentType(header.content_type)

    let b = binary(sfo)
        .word32bu('magic')
        .buffer('version', 4)
        .word32lu('key_table_start')
        .word32lu('data_table_start')
        .word32lu('tables_entries')

        .loop(function(endSeg, vars) {
            for (var i in range(vars.tables_entries)) {
                let index_entry_offset = 0x14 + i * 0x10
                let index_key_offset = vars.key_table_start + Buffer.from(sfo).readUInt16LE(index_entry_offset + 0x00)

                let index_data_offset = vars.data_table_start + Buffer.from(sfo).readUInt32LE(index_entry_offset + 0x0c)
                let index_data_fmt = Buffer.from(sfo).readUInt16LE(index_entry_offset + 0x02)
                let index_data_len = Buffer.from(sfo).readUInt32LE(index_entry_offset + 0x04)

                let index_data = sfo.slice(index_data_offset, index_data_offset + index_data_len)

                let arrslice = this.getSlice(index_key_offset, 0x11).toString()

                let key = ''
                var value = null

                for (var j = 0; j < arrslice.length; j++) {
                    if (arrslice.charAt(j) === '\u0000') {
                        break
                    }
                    key += arrslice.charAt(j)
                }

                if (index_data_fmt === 0x0004 || index_data_fmt === 0x0204) {
                    if (index_data_fmt === 0x0204) {
                        for (var k = 0; k < index_data_len; k++) {
                            if (index_data[k] === 0) {
                                index_data = index_data.slice(0, k)
                                break
                            }
                        }
                    }
                    value = index_data.toString()
                }
                else if (index_data_fmt === 0x0404) {
                    value = index_data.readUInt32LE(0)
                }

                switch(key) {
                    case 'TITLE':
                        parsedSFO.title = value
                        break;
                    case 'TITLE_ID':
                        parsedSFO.title_id = value
                        break;
                    case 'CONTENT_ID':
                        parsedSFO.content_id = value
                        parsedSFO.region = getRegion(value.slice(0,1))
                        break;
                    case 'PSP2_DISP_VER':
                        parsedSFO.min_ver = value
                        break;
                    case 'CATEGORY':
                        parsedSFO.category = value
                        break;
                    case 'APP_VER':
                        parsedSFO.app_ver = value
                        break;
                    case 'PUBTOOLINFO':
                        try {
                            parsedSFO.sdk_ver = value.slice(24, 32) / 1000000
                            parsedSFO.c_date = value.slice(7, 15)
                        } catch(error) {
                            console.error(error)
                        }
                        break;
                    default:
                        break;
                }
            }
            endSeg()
        })
        .vars


    function setContentType(id) {
        switch(id) {
            case 0x1 || 0x6:
                if (id === 0x6) {
                    parsedSFO.psx_title_id = header.slice(712, 721).toString()
                }
                parsedSFO.type = 'PSX GAME'
                break
            case 0x4 || 0xB:
                if (parsedSFO.type_0B) {
                    parsedSFO.type = 'PS3 UPDATE'
                } else {
                    parsedSFO.type = 'PS3 DLC'
                }
                break
            case 0x5:
                parsedSFO.type = 'PS3 GAME'
                break
            case 0x7:
                if (parsedSFO.type_0B) {
                    parsedSFO.type = 'PSP DLC'
                } else {
                    parsedSFO.type = 'PSP GAME'
                }
                break
            case 0x9:
                parsedSFO.type = 'PSP or PS3 THEME'
                break
            case 0xB:
                parsedSFO.type = 'PS3 UPDATE'
                break
            case 0xD:
                parsedSFO.type = 'PS3 AVATAR'
                break
            case 0x15:
                parsedSFO.type = 'VITA APP'
                break
            case 0x16:
                parsedSFO.type = 'VITA DLC'
                break
            case 0x1F:
                parsedSFO.type = 'VITA THEME'
                break
            case 0x18:
                parsedSFO.type = 'PSM GAME'
                break
            default:
                console.error('ERROR: PKG content type ' + id + ' not supported.')
        }
    }

    return parsedSFO
}

// http://www.psdevwiki.com/ps3/PKG_files#File_Header_2
function getHeader(dataBuffer) {
    var b = binary(dataBuffer)
        .magic(4, 0x7F504B47)
        .word16bu('pkg_revision')
        .word16bu('pkg_type')
        .word32bu('pkg_metadata_offset')
        .word32bu('ctype')
        .word32bu('size')
        .skip(-8)
        .word32bu('pkg_metadata_count')
        .word32bu('pkg_metadata_size')
        .word32bu('item_count')
        .word64bu('total_size')
        .word64bu('data_offset')
        .word64bu('data_size')
        .buffer('content_id', 0x24)
        .loop(function(endSeg, vars) {
            this
                .word32bu('ctype')
                .word32bu('size')
                .tap((vars) => {
                    if (vars.ctype === 0x1) {
                        this.word32bu('drm_type')
                        // vars.pkg_metadata_offset += 4 * vars.size
                    }
                    else if (vars.ctype === 0x2) {
                        this.word32bu('content_type')
                    }
                    else if (vars.ctype === 0xA) {
                        vars.type_0A = true
                    }
                    else if (vars.ctype === 0xB) {
                        vars.type_0B = true
                    }
                    else if (vars.ctype === 0xE) {
                        this.word32bu('sfo_offset')
                            .word32bu('sfo_size')
                            .setOffset('sfo_offset')
                            .buffer('sfo', 'sfo_size')
                        endSeg()
                    }
                })
        })
        .vars;

    return b
}
