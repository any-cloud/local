import path from "path";
const { http } = require(process.cwd());

export default {
  command: "start",
  aliases: [],
  desc: "start a local runtime of any-cloud",
  builder: yargs => {},
  handler: argv => {
    const port = argv.port || process.env.PORT || 4000;
    const server = http();
    server.listen(port, () => console.log(`🚀 Server ready on port ${port}!`));
  }
};
