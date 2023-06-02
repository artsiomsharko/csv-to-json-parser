const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const GoogleDriveService = require("./googleDriveService");

dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

const googleDriveService = new GoogleDriveService(
  driveClientId,
  driveClientSecret,
  driveRedirectUri,
  driveRefreshToken
);

async function sendOnGDrive(file) {
  const filePath = path.resolve(file);
  const fileName = Date.now() + "-" + path.basename(filePath);
  const folderName = "JSON";

  console.log(`\nUploading on GDrive. File path: /${folderName}/${fileName}`);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found!");
    }

    let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
      console.error(error);
      return null;
    });

    if (!folder) {
      folder = await googleDriveService.createFolder(folderName);
    }

    await googleDriveService
      .saveFile(fileName, filePath, "application/json", folder.id)
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.error(err);
  }

  console.log("✅ File uploaded successfully!");
}

module.exports = { sendOnGDrive };
