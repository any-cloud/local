const { workers: appWorkers, cron: appCronJobs } = require(process.cwd());

module.exports = async function({ data: { jobName, ...data } }) {
  const jobFn = appWorkers[jobName] || appCronJobs[jobName][1];

  return jobFn(data);
};
