const path = require("path");
const { exec } = require("child_process");

const executePy = (filePath, inputPath) => {
  const input = path.basename(inputPath);
  return new Promise((resolve, reject) => {
    exec(`python ${filePath} < ../input/${input}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = {
  executePy
};
