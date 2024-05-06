const express = require('express');
const fileUpload = require('express-fileupload');
const convertDocxToDita = require("./index")
const app = express();
const PORT = 8000;
const path = require("path");
const fs = require('fs');
const outputFile = path.join(__dirname, "./output");
const shell = require("shelljs");
const cors = require('cors');
app.use(fileUpload());
app.use(cors())
let inputDocxFile = path.join(__dirname, `./inputs/`);
// Route to handle file upload
app.post('/api/upload', async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const docxFile = req.files.file;
  // Validate file type
  if (docxFile.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return res.status(400).send('Invalid file type. Please upload a DOCX file.');
  }
  // Move the uploaded file to a folder 
  docxFile.mv(`inputs/${docxFile.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    // Delete previously uploaded files
    fs.readdir('inputs', (err, files) => {
      if (err) {
        return res.status(500).send(err);
      }

      files.forEach(file => {
        // Skip the currently uploaded file
        if (file !== docxFile.name) {
          fs.unlink(`inputs/${file}`, err => {
            if (err) {
              return res.status(500).send(err);
            }
          });
        }
      });
    });
    res.status(200).send({ message: `File "${docxFile.name}" uploaded successfully.` });

  });
});

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

  try {
  fs.readdir(inputDocxFile, async (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }
      // Iterate through each file in the folder
      const newState = [];

  // Iterate through each file in the folder
  for (const file of files) {
    // Construct the full path to the file
    const filePath = path.join(inputDocxFile, file);

    // Call the function and store the output in the state
    const output = await convertDocxToDita(filePath);
    newState.push(output);
  }
  StateManager.setState(newState);
    var downloadLink=StateManager.getState()
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
  fs.readdir('output', (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    files.forEach(file => {
      const folderPath = path.join(__dirname, 'output', file);
      cleanupUploadedZip(folderPath);
    });
  });

  fs.readdir('downloads', (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    files.forEach(file => {
      const filePath = path.join('downloads', file);

      cleanupUploadedZip(filePath); 
    
    });
 
  });
  } catch (error) {
    // Send an error response
    console.error("Error converting DOCX to DITA:", error);
    res.status(500).send("Internal server error.");
  }
});

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
  console.log(`Server is running on http://localhost:${PORT}`);
});

function cleanupUploadedZip(FolderDir) {
  try {
    // Check if the directory exists before attempting to remove it
    if (fs.existsSync(FolderDir)) {
      // Remove the directory recursively
      shell.rm("-rf", FolderDir);
      console.log("Successfully cleaned up uploaded zip file:", FolderDir);
    } else {
      console.log("Directory does not exist:", FolderDir);
    }
  } catch (error) {
    console.error("Error cleaning up uploaded zip file:", error);
  }
}
