const downloadGitRepo = require('download-git-repo')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const chalk = require('chalk')

function $do(o) {
  const fileContentsString = o.files[o.fileName].contents.toString() //Handlebar compile 前需要转换为字符串
  o.files[o.fileName].contents = Buffer.from(Handlebars.compile(fileContentsString)(o.metalsmith.metadata()))
}

module.exports = function (project, cacheDir, inputData, pDir, filter) {
  return new Promise(function (resolve, reject) {
    downloadGitRepo(project, cacheDir, false, err => {
      if (err) {
        console.log('download-git error：', chalk.red(`${err}`))
        reject(err)
      } else {
        Metalsmith(process.cwd())
            .metadata(inputData) //metadata 为用户输入的内容
            .clean(false)
            .source(cacheDir) //模板文件 path
            .destination(pDir) //最终编译好的文件存放位置
            .use((files, metalsmith, done) => {
              Object.keys(files).forEach(fileName => { //遍历替换模板
                if (filter) {
                  filter({fileName, metalsmith, files}, $do)
                } else {
                  $do({fileName, metalsmith, files})
                }
              })
              done()
            }).build(err => { // build
          if (err) {
            console.log('Metalsmith error：', chalk.red(`${err}`))
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}
