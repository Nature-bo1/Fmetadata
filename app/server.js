"use strict";

import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

export default function server() {

  let app = express(),
      port = process.env.PORT || 8080,
      pugName = path.resolve("./views/index.pug"),
      scriptName = path.resolve("./views/script.js"),
      response = {},
      storage = multer.diskStorage({ // <------------ multer.diskStorage setting
        destination: (req, file, cb) => {
          cb(null, "./uploads");
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
        }
      }),
      upload = multer({ // <----------------- setup multer with storage & limits
        storage: storage,
        limits: {fileSize: 5000000}
      }).single("userFile");

  app.set("views", __dirname + "./views");
  app.set("view engine", "pug");

  app.listen(port, () => {
    console.log("Listening on port: " + port);
  });

  app.get("/", (req, res) => {
    res.status(200).render(pugName);
    console.log("Rendered & sent " + pugName);
  });

  app.get("/script.js", (req, res) => {
    res.status(200).sendFile(scriptName);
    console.log("Sent script " + scriptName);
  });

  app.post("/upload", (req, res) => { // <--------- handling uploads with multer
    upload(req, res, err => {
      if (err) {
        console.log("Uploading file: " + err);
        return res.json(err);
      } else {
        response = {
          name: req.file.originalname,
          size: req.file.size,
          date: new Date().toLocaleString(),
          file: req.file.filename
        };
        res.status(200).json(response);
        console.log("Uploaded as: " + req.file.filename);
        fs.unlink("./uploads/" + req.file.filename,
            () => console.log("Deleted: " + req.file.filename));
      }
    });
  });

  app.use((req, res, next) => {
    console.log("Status 404.");
    res.status(404).send("Wrong address used.");
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal server error.");
  });

};