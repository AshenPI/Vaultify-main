// Required packages
const http = require('http');
const proxy = require('http-proxy');
// Create proxy server
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  const rndInt = randomIntFromInterval(0,1)
  console.log("",rndInt)


const proxyServer = proxy.createProxyServer()
const targets = [
'http://192.168.3.74:3000',
'http://192.168.3.75:3000'
]
http.createServer((req, res) => {
// Add any needed fields to 
proxyServer.web(req, res, { target: targets[rndInt] })
}).listen(3000, () => {
console.log('Load balancer is running in port 3000')
})


























