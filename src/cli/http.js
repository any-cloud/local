import path from "path"
const { http } = require(process.cwd());

export default {
  command: 'http',
  aliases: [],
  desc: 'start the http service with currently selected plugin',
  builder: (yargs) => { yargs.option('port');},
  handler : (argv) => {
    const port = argv.port || process.env.PORT || 4000;
    const server = http();
    server.listen(port, () => console.log(`🚀 Server ready on port ${port}!`));
  }
}
