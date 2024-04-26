const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const shell = require("shelljs");
// const checkFilesInFolder = require("./utils/index.js");
const app = express();
const PORT = process.env.PORT || 3000;
const AdmZip = require("adm-zip");
const archiver = require("archiver");
const fileValidator = require("./utils/fileValidator");
const isValidDirectory = require("./utils/ValidDirectory");

app.use(cors());

app.use(fileUpload()); // Add file upload middleware

let inputFolderDir = "input";
const outputFolderPath = "./output";

let ditaMapEntries = [];

// API route to handle file upload and processing
app.post("/api/upload", async (req, res) => {
  try {
    // Ensure the 'input' directory exists
    const inputDir = path.join(__dirname, inputFolderDir);
    console.log(inputDir);
    if (!fs.existsSync(inputDir)) {
      shell.mkdir("-p", inputDir);
    } else if (fs.existsSync(inputDir)) {
      shell.rm("-rf", inputDir);
      shell.mkdir("-p", inputDir);
    }

    // Ensure the 'output' directory exists
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    // Move the uploaded zip file to the input directory
    await zipFile.mv(path.join(inputDir, zipFile.name));

    // Extract the zip file
    const inputFolder = path.join(inputDir, zipFile.name);
    const zip = new AdmZip(inputFolder);
    zip.extractAllTo(inputFolderDir, /*overwrite*/ true);

    // Validate files asynchronously
    fileValidator(inputFolderDir)
      .then((counts) => {
        if (counts.mdCounter === 0) {
          // If no markdown files found, delete the input directory
          shell.rm("-rf", inputDir);
          return res.status(400).json({
            message: "No markdown files found in zip file.",
            status: 400,
          });
          
        } else {
          // If markdown files found, send success response
          return res.status(200).json({
            message: "Zip file uploaded and extracted successfully...",
            status: 200,
          });
        }

      })
      .catch((error) => {
        // Handle any errors that might occur during validation
        console.error("Error validating files:", error);
        return res.status(500).json({
          message: "Internal server error during file validation",
          status: 500,
        });
      })
      .finally(() => {
        // Remove the zip file after extraction and validation
        fs.unlinkSync(inputFolder);
      });
  } catch (error) {
    // Handle any errors that might occur during the file upload process
    console.error("Error handling file upload:", error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

app.get("/api/markdowntodita", async (req, res) => {
  try {
    // Process the files in the input directory
    const isValid = await isValidDirectory(inputFolderDir);

    if (!isValid) {
      return res
        .status(404)
        .json({ message: "Please upload zip file first!", status: 404 });
    } else if (isValid) {
      // await checkFilesInFolder(inputFolderDir);

      checkFilesInFolder(inputFolderDir, ditaMapEntries)
        .then(() => {
          // Check if the output folder exists

          const folderExists = fs.existsSync(outputFolderPath);
          if (!folderExists) {
            return res
              .status(404)
              .json({ message: "Output folder not found", status: 404 });
          }

          // Create a unique identifier for the download link
          const downloadId = Math.random().toString(36).substring(7);
          const downloadLink = `http://localhost:${PORT}/api/download/${downloadId}`;

          const downloadPath = path.join(__dirname, "downloads", downloadId);
          fs.mkdirSync(downloadPath, { recursive: true });
          const outputZipPath = path.join(downloadPath, "output.zip");

          // Create a zip file
          const output = fs.createWriteStream(outputZipPath);
          const archive = archiver("zip", {
            zlib: { level: 9 }, // Set compression level
          });

          // Pipe the archive data to the output file
          archive.pipe(output);

          // Add the output folder to the archive
          archive.directory(outputFolderPath, false);

          // Finalize the archive
          archive.finalize();

          // Cleanup the uploaded zip file
          cleanupUploadedZip(inputFolderDir);

          // Send response indicating successful processing and the download link

          res.status(200).json({
            message: "Files converted successfully.",
            downloadLink,
            status: 200,
          });

          //console.log(JSON.stringify(ditaMapEntries, null, 2));
          // console.log(ditaMapEntries);

          function cloneArray(array) {
            return JSON.parse(JSON.stringify(array));
          }

          function moveChildren(arrayOfObjects) {
            const hierarchy = {};

            // Construct hierarchy
            arrayOfObjects.forEach((folder) => {
              const folderName = folder.folder;
              folder.children.forEach((child) => {
                const level = parseInt(child.level);
                if (!hierarchy[folderName]) hierarchy[folderName] = {};
                if (!hierarchy[folderName][level])
                  hierarchy[folderName][level] = [];
                hierarchy[folderName][level].push(child);
              });
            });

            // Reconstruct array
            const structuredArray = [];
            for (const folderName in hierarchy) {
              const folder = {
                folder: folderName,
                children: [],
              };
              for (let level in hierarchy[folderName]) {
                hierarchy[folderName][level].forEach((child) => {
                  if (level === "1") {
                    folder.children.push(child);
                  } else {
                    const parentLevel = parseInt(level) - 1;
                    const parentLevelChildren =
                      hierarchy[folderName][parentLevel];
                    if (parentLevelChildren) {
                      parentLevelChildren.forEach((parentChild) => {
                        if (!parentChild.child) parentChild.child = [];
                        parentChild.child.push(child);
                      });
                    } else {
                      // Create parent level child if it doesn't exist
                      const parentLevelChild = {
                        path: child.path
                          .split("/")
                          .slice(0, parentLevel)
                          .join("/"),
                        level: `${parentLevel}`,
                        child: [child],
                      };
                      hierarchy[folderName][parentLevel] = [parentLevelChild];
                    }
                  }
                });
              }
              structuredArray.push(folder);
            }
            return structuredArray;
          }

          let duplicateArr = cloneArray(ditaMapEntries);
          let modifiedArr = moveChildren(duplicateArr);

          //console.log(JSON.stringify(modifiedArr, null, 2));

          const includedPaths = new Set();

          function buildXML(data) {
            let xml = "";

            //  data="${item.level ? item.level : "1"}"

            data.forEach((item) => {
              const path =
                item.children && item.children.length > 0
                  ? item.children[0].path
                  : item.path;
              if (!includedPaths.has(path)) {
                xml += `<topicref href="${path
                  .split("/")
                  .filter((_, index) => index !== 1)
                  .join("/")}" data="${item.level ? item.level : "1"}"`;
                if (item.children && item.children.length > 1) {
                  xml += ">\n";
                  includedPaths.add(path);
                  xml += buildXML(item.children);
                  xml += `</topicref>\n`;
                } else {
                  xml += "/>\n";
                  includedPaths.add(path);
                }
              }
            });

            return xml;
          }

          const xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
 <map>\n${buildXML(ditaMapEntries)}</map>`;

          fs.writeFileSync(`${outputFolderPath}/test.ditamap`, xmlString);
          console.log("XML structure created successfully!");

          ditaMapEntries = [];
        })
        .catch((error) => {
          console.error("Error processing files:", error);
        });
    }
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

// API route to download the processed files
app.get("/api/download/:downloadId", (req, res) => {
  const downloadId = req.params.downloadId;
  const downloadPath = path.join(
    __dirname,
    "downloads",
    downloadId,
    "output.zip"
  );

  // Check if the file exists
  if (fs.existsSync(downloadPath)) {
    // Set response headers for downloading the zip file
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=output.zip");

    // Pipe the zip file to the response
    const fileStream = fs.createReadStream(downloadPath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: "File not found", status: 404 });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function cleanupUploadedZip(inputFolderDir) {
  try {
    // Remove the directory recursively
    // shell.rm("-rf", inputFolderDir);

    console.log("Input folder removed");
  } catch (error) {
    console.error("Error cleaning up uploaded zip file:", error);
  }
}
