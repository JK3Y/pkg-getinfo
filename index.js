const fetch = require('node-fetch');
const Headers = fetch.Headers;

/**
 * Getinfo Function
 *
 * @param {string} url Absolute url to pkg
 * @param {function} cb Callback function
 * @return void
 */
exports.getinfo = (url, cb) => {
    let data = {
        type: null,
        titleId: null,
        region: null,
        contentId: null,
        size: 0,
        prettySize: 0,
        name: null,
        requiredFw: -1,
        appVersion: -1,
    };

    requestData(url)
        .then(getHeader)
        .then(parseSFO)
        .then(function(sfoData) {
            data.type = sfoData.pkg_type
            data.titleId = sfoData.titleId
            data.region = getRegion(sfoData.contentId.charAt(0))
            data.contentId = sfoData.contentId
            data.size = sfoData.total_size
            data.prettySize = humanFileSize(sfoData.total_size, true)
            data.name = sfoData.title
            data.requiredFw = sfoData.min_ver
            data.appVersion = sfoData.app_ver
            data.pkg_psxtitleid = sfoData.pkg_psxtitleid


            cb(data)
        })
};

function requestData(url) {
    const opts = {
        headers: new Headers({
            'Range': 'bytes=0-10000'
        })
    };
    return fetch(url, opts)
        .then(res => res.buffer())
}

// http://www.psdevwiki.com/ps3/PKG_files#File_Header_2
function getHeader(dataBuffer) {
    let drm_type,
        type_0A,
        type_0B,
        pkg_type,
        pkg_psxtitleid,
        contentId,
        content_type = 0,
        sfo_offset = 0,
        sfo_size = 0;

    let magic = dataBuffer.slice(0, 4);

    if (magic.readInt32BE(0) !== 0x7F504B47) return;

    // Read offset where meta data begins
    let meta_offset = dataBuffer.slice(8, 8 + 4);

    // Read number of meta data elements
    let meta_count = dataBuffer.slice(12, 12 + 4);

    // Read total PKG size from header
    let total_size = dataBuffer.slice(24, 24 + 8).readInt32BE(4);

    contentId = dataBuffer.slice(48, 48 + 36);

    let offset = meta_offset.readInt32BE(0);

    for (let i = 0; i <= meta_count.readInt32BE(0); i++) {
        ctype = dataBuffer.slice(offset, offset + 4);
        size = dataBuffer.slice(offset + 4, offset + 8);

        // DRM type element found
        if (ctype.readInt32BE(0) === 0x1) {
            drm_type = dataBuffer.slice(offset + 8, offset + 12)
        }

        // Content type element found
        if (ctype.readInt32BE(0) === 0x2) {
            content_type = dataBuffer.slice(offset + 8, offset + 12)
        }

        // Install directory element found (PSP, PS3)
        if (ctype.readInt32BE(0) === 0xA) {
            type_0A = true
        }

        // Unknown element found; seen in PSP cumulative patch
        if (ctype.readInt32BE(0) === 0xB) {
            type_0B = true
        }

        // PARAM.SFO offset and size element found
        if (ctype.readInt32BE(0) === 0xE) {
            sfo_offset = dataBuffer.slice(offset + 8, offset + 12);
            sfo_size = dataBuffer.slice(offset + 12, offset + 16)
        }

        offset += (2 * 4 + size.readInt32BE(0))
    }


    if ((content_type.readInt32BE() === 0x1) ||
        (content_type.readInt32BE() === 0x6)) {
        pkg_type = 'PSX GAME';
        if (content_type.readInt32BE() === 0x6) {
            pkg_psxtitleid = dataBuffer.slice(712, 721).toString()
        }
    }
    else if ((content_type.readInt32BE() === 0x4) ||
        (content_type.readInt32BE() === 0xB)) {
        if (type_0B) {
            pkg_type = 'PS3 UPDATE'
        } else {
            pkg_type = 'PS3 DLC'
        }
    }
    else if (content_type.readInt32BE() === 0x5) {
        pkg_type = 'PS3 GAME'
    }
    else if (content_type.readInt32BE() === 0x7) {
        if (type_0B) {
            pkg_type = 'PSP DLC'
        } else {
            pkg_type = 'PSP GAME'
        }
    }
    else if (content_type.readInt32BE() === 0x9) {
        pkg_type = 'PSP or PS3 THEME'
    }
    else if (content_type.readInt32BE() === 0xD) {
        pkg_type = 'PS3 AVATAR'
    }
    else if (content_type.readInt32BE() === 0x15) {
        pkg_type = 'VITA APP'
    }
    else if (content_type.readInt32BE() === 0x16) {
        pkg_type = 'VITA DLC'
    }
    else if (content_type.readInt32BE() === 0x1F) {
        pkg_type = 'VITA THEME'
    }
    else if (content_type.readInt32BE() === 0x18) {
        pkg_type = 'PSM GAME'
    }

    return {
        drm_type: drm_type,
        type_0A: type_0A,
        type_0B: type_0B,
        pkg_type: pkg_type,
        pkg_psxtitleid: pkg_psxtitleid,
        contentId: contentId,
        content_type: content_type,
        sfo_offset: sfo_offset,
        sfo_size: sfo_size,
        total_size: total_size,
        sfo: dataBuffer.slice(sfo_offset.readInt32BE(), sfo_offset.readInt32BE() + sfo_size.readInt32BE())
    }
}


function parseSFO(header) {
    let sfo = header.sfo;

    if (header.sfo_offset <= 0) return header;

    // Check MAGIC '\0PSF' to verify proper SFO file
    if (sfo.slice(0, 4).readInt32BE(0) !== 0x00505346) return header;

    let sfo_key_table_start = sfo.readInt32LE(0x08)
    let sfo_data_table_start = sfo.readInt32LE(0x0C)
    let sfo_tables_entries = sfo.readInt32LE(0x10)

    for (let i = 0; i < sfo_tables_entries; i++) {
        let sfo_index_entry_ofs = 0x14 + i * 0x10
        let sfo_index_key_ofs = sfo_key_table_start + sfo.readInt16LE(sfo_index_entry_ofs + 0x00)

        let sfo_index_key = ''

        let arr = sfo.slice(sfo_index_key_ofs).toString()

        for (chr in arr) {
            if (arr.charAt(chr) === '\u0000') break;
            sfo_index_key += arr.charAt(chr)
        }

        let sfo_index_keyname = sfo_index_key.toString()
        let sfo_index_data_ofs = sfo_data_table_start + sfo.readInt32LE(sfo_index_entry_ofs + 0x0C)
        let sfo_index_data_fmt = sfo.readInt16LE(sfo_index_entry_ofs + 0x02)
        let sfo_index_data_len = sfo.readInt32LE(sfo_index_entry_ofs + 0x04)
        let sfo_index_data = sfo.slice(sfo_index_data_ofs, sfo_index_data_ofs + sfo_index_data_len)

        let value

        if ((sfo_index_data_fmt === 0x0004) ||
            (sfo_index_data_fmt === 0x0204)) {
            if (sfo_index_data_fmt === 0x0204) {
                for (let j = 0; j < sfo_index_data_len; j++) {
                    if (sfo_index_data.toString().charAt(j) === '\u0000') {
                        sfo_index_data = sfo_index_data.slice(0, j)
                        break;
                    }

                }
            }
            value = sfo_index_data.toString()
        }
        else if (sfo_index_data_fmt === 0x0404) {
            value = sfo_index_data.readInt32LE(0x00)
        }

        if (sfo_index_keyname === 'TITLE') {
            header.title = value
        }
        else if (sfo_index_keyname === 'CONTENT_ID') {
            header.contentId = value
        }
        else if (sfo_index_keyname === 'TITLE_ID') {
            header.titleId = value
        }
        else if (sfo_index_keyname === 'PSP2_DISP_VER') {
            header.min_ver = parseFloat(value)
        }
        else if (sfo_index_keyname === 'CATEGORY') {
            header.category = value
        }
        else if (sfo_index_keyname === 'APP_VER') {
            header.app_ver = parseFloat(value)
        }
        else if (sfo_index_keyname === 'PUBTOOLINFO') {
            try {
                header.sdk_ver = value.slice(24, 32) / 1000000
                header.c_date = value.slice(7, 15)
            } catch (err) {
                console.log(err)
            }
        }
    }

    return header
}

function getRegion(id) {
    switch(id) {
        case 'U':
            return 'US';
        case 'E':
            return 'EU';
        case 'J':
            return 'JP';
        case 'K':
            return 'ASIA(KOR)';
        case 'H':
            return 'ASIA(HKG)';
        case 'I':
            return 'INT';
        default:
            return '???'
    }
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}