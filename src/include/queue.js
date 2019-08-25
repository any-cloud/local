import Queue from "bull";
import path from "path";

let onlyQueue;

export const init = () => {
    onlyQueue = new Queue("only");
    onlyQueue.process(path.join(__dirname, "worker.js"));
    return onlyQueue;
}

export const push = (jobName, args) => {
  onlyQueue.add({jobName, ...args});
};
