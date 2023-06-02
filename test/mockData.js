const fs = require("fs");
const path = require("path");

console.time("CSV file successfully created in");

const sizeInGb = 1;
const neededSize = sizeInGb * 1024 * 1024 * 1024;

const mockPath = path.join("assets", "test.csv");
const resultPath = path.join("assets", `large-${sizeInGb}Gb.csv`);

const mock = fs.readFileSync(mockPath).toString();
const header = mock.substring(0, mock.indexOf("\r"));
const data = "\n" + mock.substring(mock.indexOf("\r") + 1);

const writeStream = fs.createWriteStream(resultPath);
writeStream.write(header);
writeData();

let currentSize = writeStream.bytesWritten;

function writeData() {
  while (currentSize < neededSize) {
    currentSize = writeStream.bytesWritten;

    updateLoadingBar(
      Math.floor(neededSize / (1024 * 1024)),
      Math.floor(currentSize / (1024 * 1024))
    );

    const isWriteable = writeStream.write(data);

    if (!isWriteable) {
      writeStream.once("drain", writeData);
      return;
    }
  }

  writeStream.end(() => {
    console.timeEnd("CSV file successfully created in");
  });
}

function updateLoadingBar(totalSize, currentSize) {
  const progress = Math.floor((currentSize / totalSize) * 100);
  const barLength = Math.floor(progress / 2);

  const progressBar = "[" + "=".repeat(barLength) + " ".repeat(Math.max(0, 50 - barLength)) + "]";
  const progressText = `${currentSize}MB of ${totalSize}MB`;

  console.clear();
  console.log(progressBar + " " + progressText);
}
