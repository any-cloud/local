import { init } from "../include/queue";
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
    const onlyQueue = init();

    // start cron jobs
    if (appCron) {
      Object.keys(appCron).forEach(cronJobKey => {
        const cronJob = appCron[cronJobKey];
        onlyQueue.add(
          { jobName: cronJobKey },
          { repeat: { cron: cronJob[0] } }
        );
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
