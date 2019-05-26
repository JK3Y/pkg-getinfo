# pkg-getinfo

A TypeScript port of [PSN_get_pkg_info][], built for the browser.

This module obtains useful metadata from Playstation PKG URLs.

Compatible with PSM, PSX, Vita, and PSP PKGs.
 
## Install
```
yarn add https://github.com/JK3Y/pkg-getinfo.git
```

## Limitations
Unable to parse PS4 packages yet.

## Usage
```
import GetInfo from 'pkg-getinfo'
let getinfo = new GetInfo({
    baseUrl: 'http://proxy.url.to.bypass.cors'
})
let info = await getinfo.pkg(url)
console.log(info)

 /*******
 * Results
 ********/
 { 
    contentId: "JP0103-PCSG00347_00-APP0000000000000"
    creationDate: "20140214"
    itemsInfo: {ofs: 0, size: 4800, entriesSize: 2496, namesOfs: 2496, namesSize: 2296, …}
    npsType: "PSV GAME"
    pkgCidTitleId1: "PCSG00347_00-APP"
    pkgCidTitleId2: "APP0000000000000"
    pkgContentId: "JP0103-PCSG00347_00-APP0000000000000"
    pkgContentType: 21
    pkgDrmType: 2
    pkgPlatform: "PSV"
    pkgSfoOffset: 3088
    pkgSfoSize: 1328
    pkgTailSha1: Uint8Array []
    pkgTotalSize: 2367571616
    pkgType: "Game"
    prettySize: "2.2 GiB"
    region: "JP"
    sdkVer: 3
    sfoCategory: "gd"
    sfoCidDiffer: true
    sfoCidTitleId1: "PCSG00347"
    sfoCidTitleId2: "APP0000000000000"
    sfoContentId: "JP0103-PCSG00347_00-APP0000000000000"
    sfoTidDiffer: true
    sfoTitleId: "PCSG00347"
    source: "http://proxy.url.to.bypass.cors/http://zeus.dl.playstation.net/cdn/JP0103/PCSG00347_00/aaTtYWXKardsZAvtSKHMFIKXGlxlLXDugjEHQGGzCSxipwtmECgHKjFbbBFRIBOEjKGVgRivgBdEoYrGJRQTMNagvkihVOQuXRcXh.pkg"
    title: "アーシャのアトリエ Ｐｌｕｓ ～黄昏の大地の錬金術士～"
    titleId: "PCSG00347"
    titleUpdateUrl: "http://gs-sec.ww.np.dl.playstation.net/pl/np/PCSG00347/507299147b64a90f5f940051c902d70579d235e1947c19cc064da6ac88bdf532/PCSG00347-ver.xml"
 }
 ```

## Thanks
* [WindSurfer1122][] for the new and improved [PSN_get_pkg_info][]
* [AnalogMan151][] for the original [VitaPKG\_GetInfo][]

[AnalogMan151]: https://github.com/AnalogMan151
[VitaPKG\_GetInfo]: https://github.com/AnalogMan151/VitaPKG_GetInfo
[WindSurfer1122]: https://github.com/windsurfer1122
[PSN_get_pkg_info]: https://github.com/windsurfer1122/PSN_get_pkg_info
