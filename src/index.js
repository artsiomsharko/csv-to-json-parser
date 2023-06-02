const fs = require("fs");
const path = require("path");
const ProgressBar = require("./progressBar");
const converter = require("./Converter");
const { findArg, handleErrorAndExit } = require("./utils");
const { sendOnGDrive } = require("./googleDrive/googleDriveController");

const sourceFile = findArg("--sourceFile");
const resultFile = findArg("--resultFile");
const separator = findArg("--separator");

if (!sourceFile || !resultFile) {
  console.error("Error: Provide --sourceFile and --resultFile arguments");
  process.exit(1);
}

console.time("✅ Converting finished");

const readStream = fs.createReadStream(path.resolve(sourceFile));
const writeStream = fs.createWriteStream(path.resolve(resultFile));
const csvToJson = converter({ separator });

const bar = new ProgressBar(fs.statSync(sourceFile).size);

readStream.pipe(csvToJson).pipe(writeStream);

readStream
  .on("error", handleErrorAndExit)
  .on("open", () => {
    console.log("Converting started");
  })
  .on("data", (chunk) => {
    bar.tick(chunk.length);
  });

csvToJson.on("error", handleErrorAndExit);

writeStream.on("error", handleErrorAndExit).on("finish", () => {
  console.timeEnd("✅ Converting finished");
  sendOnGDrive(resultFile);
});
