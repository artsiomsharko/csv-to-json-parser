const Progress = require("progress");

function toKb(size) {
  return Math.trunc(size / 1024);
}

class ProgressBar {
  constructor(totalSize) {
    this.bar = new Progress("  |:bar| :currentKB/:totalKB :percent :etas", {
      width: 40,
      total: toKb(totalSize),
      renderThrottle: 50,
    });
  }

  tick(chunkSize) {
    this.bar.tick(toKb(chunkSize));
  }
}

module.exports = ProgressBar;
