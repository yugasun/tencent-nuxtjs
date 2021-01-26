const multer = require('multer')
const express = require('express')
const { loadNuxt } = require('nuxt')

const isServerless = process.env.SERVERLESS

async function createServer() {
  const upload = multer({ dest: isServerless ? '/tmp/upload' : './upload' })

  const server = express()
  const nuxt = await loadNuxt('start')

  server.post('/upload', upload.single('file'), (req, res) => {
    res.send({
      success: true,
      data: req.file
    })
  })

  server.all('*', (req, res, next) => {
    return nuxt.render(req, res, next)
  })

  // define binary type for response
  // if includes, will return base64 encoded, very useful for images
  server.binaryTypes = ['*/*']

  return server
}

module.exports = createServer

if (isServerless) {
  module.exports = createServer
} else {
  createServer().then((server) => {
    server.listen(3000, () => {
      console.log(`Server start on http://localhost:3000`)
    })
  })
}
