import path from "path"
const { workers } = require(process.cwd());

export default {
  command: 'workers',
  aliases: [],
  desc: 'start the workers service with currently selected plugin',
  builder: (yargs) => { yargs.option('num');},
  handler : (argv) => {
    const num = argv.num || 1;

  }
}
