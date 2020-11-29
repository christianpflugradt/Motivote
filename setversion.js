// @ts-check
const chalk = require('chalk');
const git = require('git-describe');
const path = require('path');
const fs = require('fs-extra');

const info = git.gitDescribeSync({ longSemver: true, match: '[0-9]*' });
const file = path.resolve(__dirname, 'src', 'environments', 'version.ts');

fs.writeFileSync(
  file,
  `export const VERSION = ${JSON.stringify(info)};` ,
  { encoding: 'utf-8' });

console.log(chalk.green(`Wrote version info ${info.raw} to ${path.relative(path.resolve(__dirname, '..'), file)}`));
