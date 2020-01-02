const fs = require('fs')

exports.delDir = function (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file, index) => {
      let curPath = path + "/" + file
      if (fs.statSync(curPath).isDirectory()) {
        arguments.callee(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}


exports.dirIsNul = function (root) {
  const dir = fs.readdirSync(root)
  return !dir.length
}
