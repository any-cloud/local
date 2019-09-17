import { init, http } from "@any-cloud/core";

export default {
  command: "start",
  aliases: [],
  desc: "start a local runtime of any-cloud",
  builder: yargs => {},
  handler: async argv => {
    await init();

    // start express server
    const port = argv.port || process.env.PORT || 4000;
    const server = http();
    server.listen(port, () => console.log(`🚀 Server ready on port ${port}!`));
  }
};
