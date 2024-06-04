const express = require('express');
const fileUpload = require('express-fileupload');
const convertDocxToDita = require("./index")
const app = express();
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 8000;
const path = require("path");
const fs = require('fs');
const shell = require("shelljs");
const cors = require('cors');
const { getInputFileName } = require('./utils/StateManagement');
app.use(fileUpload());
app.use(cors())
let inputDocxFile = path.join(__dirname, `./inputs/`);
const outputFile = path.join(__dirname, "../output");
const downloadFile = path.join(__dirname, "../downloads");
app.post('/api/upload', async (req, res) => {
  try {
 
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ error: 'No files were uploaded.' });
    }

    const docxFile = req.files.file;

    if (docxFile.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return res.status(400).send({ error: 'Invalid file type. Please upload a DOCX file.' });
    }

    const uniqueFilename = `${docxFile.name}`;
    const filePath = path.join(__dirname, `inputs/${uniqueFilename}`);

    await docxFile.mv(filePath);

    await cleanInputDirectory(filePath);

    res.status(200).send({ message: `File "${uniqueFilename}" uploaded successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'An unexpected error occurred.' });
  }
});

async function cleanInputDirectory(filePath) {
  const directory = path.dirname(filePath);
  try {
    const files = await fs.promises.readdir(directory);
    for (const file of files) {
      if (file !== path.basename(filePath)) {
        const fullPath = path.join(directory, file);
        await fs.promises.unlink(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error cleaning input directory: ${err.message}`);
  }
}

app.get('/api/convertDocxToDita', async (req, res) => {

  const StateManager = (() => {
    let state = [];
    return {
      getState: () => state,
      setState: (newState) => {
        state = newState;
      },
    };
  })();
  const obj = {
    downloadLink: "",
    outputId: "",
    downloadId: ""
  }
  try {
    fs.readdir(inputDocxFile, async (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }

      const newState = [];

      for (const file of files) {

        const filePath = path.join(inputDocxFile, file);

        const { downloadLink, outputId, downloadId } = await convertDocxToDita(filePath);
        obj.downloadId = downloadId;
        obj.downloadLink = downloadLink;
        obj.outputId = outputId;
        newState.push(downloadLink);
      }
      StateManager.setState(newState);
      var downloadLink = StateManager.getState()
      const outputFolderPath = outputFile;
      if (!outputFolderPath) {
        return res.status(400).send('Folder path is required.');
      }
      res.status(200).json({
        message: 'Files converted successfully.',
        downloadLink: downloadLink,
        status: 200,
      });

    })

    fs.readdir(outputFile, (err, files) => {
      if (err) {
        console.error('Error reading output folder:', err);
        return;
      }
      files.forEach(file => {
        let folderPath = path.join(outputFile, file)
        if (file !== obj.outputId) {
          cleanupUploadedZip(folderPath);
        }
      });
    });

    fs.readdir(downloadFile, (err, files) => {
      if (err) {
        console.error('Error reading download folder:', err);
        return;
      }
      files.forEach(file => {
        const filePath = path.join(__dirname, '../downloads', file);
        if (file !== obj.downloadId) {
          cleanupUploadedZip(filePath);
        }
      });
    });

  } catch (error) {

    console.error("Error converting DOCX to DITA:", error.message);
    res.status(500).send("Internal server error.");
  }
});

app.get("/api/download/:downloadId", (req, res) => {
  const downloadId = req.params.downloadId;

  originalFileName = getInputFileName()
  const downloadPath = path.join(__dirname, "../downloads", downloadId, originalFileName);

  try {
    if (fs.existsSync(downloadPath)) {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${originalFileName}"`);

      const fileStream = fs.createReadStream(downloadPath);
      fileStream.pipe(res);
      fileStream.on('error', (err) => {
        res.status(500).json({ message: "Internal Server Error", status: 500 });
      });
    } else {
      res.status(404).json({ message: "File not found", status: 404 });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

function cleanupUploadedZip(FolderDir) {
  try {
    if (fs.existsSync(FolderDir)) {
      shell.rm("-rf", FolderDir);
      console.log("Successfully cleaned up uploaded zip file:", FolderDir);
    } else {
      console.log("Directory does not exist:", FolderDir);
    }
  } catch (error) {
    console.error("Error cleaning up uploaded zip file:", error);
  }
}

