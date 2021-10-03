const Queue = require("bull");
const { executeC } = require("./executeC");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const jobQueue = new Queue("job-queue");
const NUM_WORKERS = 8;

const Job = require("./models/Job");

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  // console.log(data);
  const { id: jobId } = data;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error("Couldn't find");
  }
  console.log("Fetched Job", job);
  try {
    job["startedAt"] = new Date();
    switch (job.language) {
      case "cpp":
        output = await executeCpp(job.filepath, job.inputPath);
        break;
      case "c":
        output = await executeC(job.filepath, job.inputPath);
        break;
      case "py":
        output = await executePy(job.filepath, job.inputPath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = err;
    await job.save();
    return res.status(500).json({ success: false, err: JSON.stringify(err) });
  }

  return true;
});

jobQueue.on("failed", err => {
  console.log(err.data.id + " failed " + err.failedReason);
});

const addJobToQueue = async jobId => {
  await jobQueue.add({ id: jobId });
};

module.exports = {
  addJobToQueue
};
