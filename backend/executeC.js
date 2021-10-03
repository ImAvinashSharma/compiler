const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const input = path.basename(inputPath);
  const outPath = path.join(outputPath, `${jobId}.out`);
  return new Promise((resolve, reject) => {
    exec(`gcc ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ../input/${input}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = {
  executeC
};
