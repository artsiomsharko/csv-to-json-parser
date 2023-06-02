function findArg(argName) {
  const args = process.argv.slice(2);
  const idx = args.findIndex((v) => v === argName);
  const nextArg = args[idx + 1];

  if (idx === -1 || nextArg?.startsWith("--")) {
    return;
  }

  return nextArg;
}

function handleErrorAndExit(error) {
  console.error("Error:", error?.message || error);
  process.exit(1);
}

module.exports = { handleErrorAndExit, findArg };
