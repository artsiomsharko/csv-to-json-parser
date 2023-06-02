const { Transform } = require("stream");

class Converter extends Transform {
  constructor(options = {}) {
    super();

    this.separator = options.separator;
    this.isFirstEntry = true;
    this.keys = null;
    this.remainingLine = "";
  }

  csvToJson(line) {
    const values = line.toString().split(this.separator);
    const json = this.keys
      .map((key, idx) => {
        const value = values[idx] || "";
        return `"${key}":"${value}"`;
      })
      .join(",");

    if (this.isFirstEntry) {
      this.isFirstEntry = false;
      return `{${json}}`;
    }

    return `,\n{${json}}`;
  }

  detectSeparator(chunk) {
    const separators = [",", ";", "|", " "];
    return separators.find((separator) => chunk.includes(separator));
  }

  _transform(chunk, encoding, callback) {
    const fullChunk = this.remainingLine + chunk.toString();
    const lines = fullChunk.split(/\r?\n|\r/);

    if (lines.length > 2) {
      this.remainingLine = lines.pop();
    }

    if (!this.separator) {
      this.separator = this.detectSeparator(lines[0]);

      if (!this.separator) {
        return callback("Separator not found, provide the separator in --separator argument");
      } else {
        console.log(`✅ Detected separator: "${this.separator}"`);
      }
    }

    if (!this.keys) {
      this.keys = lines[0].toString().split(this.separator);
      this.push("[");
      lines.shift();
    }

    const transformedLines = lines.map((line) => this.csvToJson(line));
    this.push(transformedLines.join(""));

    callback();
  }

  _flush(callback) {
    if (this.remainingLine) {
      this.push(this.csvToJson(this.remainingLine));
    }

    if (this.keys) {
      this.push("]");
    }

    callback();
  }
}

module.exports = (options) => new Converter(options);
