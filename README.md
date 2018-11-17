# pkg-getinfo

A Node.js module that obtains useful metadata from Playstation PKG URLs

Works on PS3, PSM, PSX, and Vita PKGs

### Usage
```
let info = await getinfo(url)
console.log(info)

 /*******
 * Results
 ********/
 { type: 'VITA APP',
  consoleType: 'PSV',
  fileType: 'GAMES',
  titleId: 'PCSA00035',
  region: 'US',
  contentId: 'UP9000-PCSA00035_00-TABLESOCCERUS000',
  size: 191593184,
  prettySize: '191.6 MB',
  name: 'Table Soccer',
  requiredFw: 1.52,
  appVersion: 1,
  pkg_psxtitleid: undefined }
 ```

### Thanks
* [AnalogMan151][]'s very useful [VitaPKG\_GetInfo][]


[AnalogMan151]: https://github.com/AnalogMan151
[VitaPKG\_GetInfo]: https://github.com/AnalogMan151/VitaPKG_GetInfo