const express = require("express");
const { generateFile } = require("./generateFile");

const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Job = require("./models/Job");
const { addJobToQueue } = require("./jobQueue");

mongoose.connect(
  "mongodb://localhost:27017/compilerapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    err && console.log(err);
    console.log("Successfully connected to MongoDB");
  }
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (code === undefined) return res.status(400).json({ success: false, error: "Empty code module" });
  let job;
  const { filepath, inputPath } = await generateFile(language, code, input);
  job = await new Job({ language, filepath, inputPath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ success: true, jobId: jobId });
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  if (jobId === undefined) {
    return res.status(400).json({ success: false, error: "missing id query param" });
  }
  try {
    const job = await Job.findById(jobId);
    if (job === undefined) {
      return res.status(404).json({ success: false, error: "couldn't find job" });
    }
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

app.listen(8080, () => {
  console.log("Running in port 8080");
});
