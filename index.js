let GetInfo = require('./src/GetInfo').default

// new GetInfo({
//     baseUrl: 'http://proxy.nopaystation.com'
// }).pkg('http://zeus.dl.playstation.net/cdn/JP0106/PCSG01018_00/JP0106-PCSG01018_00-STARGAMEJP000000_bg_1_7a1767a3bd24d1a1aec2fe2c0c50743c9c355dc6.pkg')
// }).pkg('http://zeus.dl.playstation.net/cdn/JP0117/PCSG00782_00/JP0117-PCSG00782_00-RECOLOVE00000021_bg_1_4f47da2fe0f9439586c4b6cefcfbb36de3435169.pkg')
// }).pkg('http://zeus.dl.playstation.net/cdn/UP0017/NPUA30014_00/iSOgSAnUJA5PEjhff1DdN1cUGg8kReh21PlW2BwS4QrY77GBFNxoGkAuwkeyeGfYQUm8Mfekb41j7xeAygKeohwIvPUMTBwgLDa0s.pkg')
// }).pkg('http://zeus.dl.playstation.net/cdn/JP0103/PCSG00347_00/aaTtYWXKardsZAvtSKHMFIKXGlxlLXDugjEHQGGzCSxipwtmECgHKjFbbBFRIBOEjKGVgRivgBdEoYrGJRQTMNagvkihVOQuXRcXh.pkg')
// }).pkg('http://zeus.dl.playstation.net/cdn/EP9000/NPEO00038_00/eKVDhGfocNIcJLWBIGk7oeLRgu2NjkWEgODoBV1GCSXeEGedAiA3UsW2pmRuEO4H6Jaqc2Faj9wCO9X1GLo9RpvQPJdnnJcqIFjoL.pkg')
//   .then((result) => {
        // document.getElementById('results').innerText = JSON.stringify(result, null, 1)
        // console.log(result)
    // })
document.getElementById("btnRun").addEventListener('click', function(){
    let getinfo = new GetInfo({
        baseUrl: 'http://proxy.nopaystation.com'
    })

    let info = getinfo.pkg(document.getElementById('url').value)
    info.then((result) => {
        document.getElementById('results').innerText = JSON.stringify(result.results, null, 1)
        console.log(result)
    })

});
