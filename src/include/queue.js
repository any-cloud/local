import { cron as appCron } from "@any-cloud/core";
import Queue from "bull";
import path from "path";

let onlyQueue;

export const init = () => {
  if (onlyQueue) {
    console.warn("called queue init multiple times");
    return;
  }
  console.log("initializing only queue");
  onlyQueue = new Queue("only");
  onlyQueue.process(path.join(__dirname, "worker.js"));

  // start cron jobs
  if (appCron) {
    if (process.env.NODE_ENV === "test") {
      console.log("skipping cron in test environment");
    } else {
      Object.keys(appCron).forEach(cronJobKey => {
        const cronJob = appCron[cronJobKey];
        onlyQueue.add(
          { jobName: cronJobKey },
          { repeat: { cron: cronJob[0] } }
        );
      });
    }
  } else {
    console.log("no cron jobs found");
  }
};

export const runAll = async () => {
  await Promise.all(
    (await onlyQueue.getJobs([
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed"
    ])).map(j => j.finished())
  );
  return true;
};

export const push = async (jobName, args) => {
  await onlyQueue.add({ jobName, ...args });
  return true;
};
