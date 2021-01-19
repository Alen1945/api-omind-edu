require('dotenv').config()
const App = require('./app')
const http = require('http')
const server = http.createServer(App)
const port = process.env.PORT || 8000



server.listen(port)
server.on('listening', () => {
  console.log('Server Running on Port ' + port)
})

server.on('error', (err) => {
  console.log('Get Error')
  if (err.message) {
    console.log('error message', err.message)
  }
  console.log('detail error', err)
  throw err
})

