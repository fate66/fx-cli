#!/usr/bin/env node
var program = require('commander')
const fs = require('fs')

const chalk = require('chalk')
const pkg = require('../package.json')

if (fs.existsSync(`${process.cwd()}/bin`)) {
  process.env.NODE_ENV = 'dev'
}

program
    .version(pkg.version, '-v, --version')
    .usage('cli 帮助信息')


program
    .command('init')
    .description('init project')
    .action(function (arg, cmdObj) {
      require('./lib/create')()
    })

program
    .arguments('<command>')
    .action((cmd) => {
      program.outputHelp()
      console.log(chalk.red(`${cmd}无效`))
    })
program.parse(process.argv)


function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    console.log(o, '--')
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
