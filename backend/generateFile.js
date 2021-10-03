const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
const dirInput = path.join(__dirname, "input");

if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });
if (!fs.existsSync(dirInput)) fs.mkdirSync(dirInput, { recursive: true });

const generateFile = async (format, code, input) => {
  const jobId = uuid();
  const fileName = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, fileName);
  const inputPath = path.join(dirInput, `${jobId}.txt`);
  await fs.writeFileSync(filepath, code);
  await fs.writeFileSync(inputPath, input);
  return { filepath, inputPath };
};

module.exports = {
  generateFile
};
