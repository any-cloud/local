import path from "path";
import * as cron from "node-cron";
import { queue } from "@any-cloud/core";
const {
  http: appHttp,
  cron: appCron,
  workers: appWorkers
} = require(process.cwd());

export default {
  command: "start",
  aliases: [],
  desc: "start a local runtime of any-cloud",
  builder: yargs => {},
  handler: argv => {
    // register worker jobs
    if (appWorkers) {
      Object.values(appWorkers).forEach(worker => {
        queue.register(worker);
      });
    } else {
      console.log("no workers found");
    }

    // start cron jobs
    if (appCron) {
      Object.values(appCron).forEach(cronJob => {
        cron.schedule(...cronJob);
      });
    } else {
      console.log("no cron jobs found");
    }

    // start express server
    const port = argv.port || process.env.PORT || 4000;
    const server = appHttp();
    server.listen(port, () => console.log(`🚀 Server ready on port ${port}!`));
  }
};
