import GetInfo from './src/GetInfo'

document.getElementById("btnRun").addEventListener('click', function(){
    let getinfo = new GetInfo({
        baseUrl: 'http://proxy.nopaystation.com'
    })

    let info = getinfo.pkg(document.getElementById('url').value)
    info.then((result) => {
        document.getElementById('results').innerText = JSON.stringify(result, null, 1)
        console.log(result)
    })

});
