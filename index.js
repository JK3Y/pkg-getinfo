import getInfo from './src/getinfo'

document.getElementById("btnRun").addEventListener('click', function(){
    let info = getInfo(document.getElementById('url').value)
    info.then((result) => {
        document.getElementById('results').innerText = JSON.stringify(result, null, 1)
        console.log(result)
    })

});
