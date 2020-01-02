#!/usr/bin/env node
var inquirer = require('inquirer')
const generator = require('./generator')
const fs = require('fs')
const utils = require('../utils/utils.js')
const chalk = require('chalk')

function start(x) {
  generator('fate66/multiple-pages', x.templateDir, x.outData, x.rootDir, function (o, done) {
    if (!(o.fileName.includes('src') || o.fileName.includes('repositories'))) {
      done(o)
    }
  }).then(res => {
    console.log(chalk.green(`delete cache`))
    utils.delDir(`${process.cwd()}/.template`)
    utils.delDir(`${process.cwd()}/repositories`)
    console.log(chalk.blue(`project init success!`))
  })
}

function delFileOrDir(root, file) {
  const path = `${root}/${file}`
  if (fs.statSync(path).isDirectory()) {
    console.log(chalk.green(`delete directory：`), file)
    utils.delDir(path)
  } else {
    console.log(chalk.yellow(`delete file：`), file)
    fs.unlinkSync(path)
  }
}

function devIsolation(file) {
  return !(file == 'bin' || file == 'node_modules' || file == 'package.json' || file == 'package-lock.json' || file == '.idea')
}

function isolation(file) {
  return !(file == '.git' || file == '.idea')
}


module.exports = function () {
  inquirer.prompt([
    {
      type: 'list',
      message: '请选择项目类型:',
      name: 'template',
      choices: [
        "H5",
        "npm",
      ],
      filter: function (val) { // 使用filter将回答变为小写
        return val.toLowerCase();
      }
    },
    {
      type: 'input',
      message: '请输入项目名称',
      name: 'projectName',
      default: "my-project"
    },
    {
      type: 'input',
      message: '请输入CDN名称',
      name: 'cndName',
      default: "my-cdn"
    }
  ]).then(outData => {
    const rootDir = process.cwd()
    const templateDir = `${rootDir}/.template`
    const o = {outData, templateDir, rootDir}
    const p = []
    
    const root_files = fs.readdirSync(rootDir)
    let f = false
    root_files.length && root_files.forEach(function (file) {
      if (process.env.NODE_ENV == 'dev') {
        if (devIsolation(file)) {
          f = true
        }
      } else {
        if (isolation(file)) {
          f = true
        }
      }
    })
    
    
    f && p.push({
      type: "confirm",
      message: `当前文件夹除了.git外，存在其它文件，是否删除？`,
      name: "d",
      suffix: "同意输入y,拒绝输入n。拒绝将无法创建项目"
    })
    if (p.length) {
      inquirer.prompt(p).then(r => {
        if (r.d) {
          root_files.forEach(function (file) {
            if (process.env.NODE_ENV == 'dev') {
              if (devIsolation(file)) {
                delFileOrDir(rootDir, file)
              }
            } else {
              if (isolation(file)) {
                delFileOrDir(rootDir, file)
              }
            }
          })
          console.log(chalk.blue(`project download...`))
          start(o)
        } else {
          console.log(chalk.red(`你禁止删除目录，程序已结束！！！`))
        }
        
      })
    } else {
      console.log(chalk.blue(`project install...`))
      start(o)
    }
    
    
  })
}


