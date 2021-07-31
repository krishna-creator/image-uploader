const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const images = require("./model/image");
const multer = require("multer");
const cors = require("cors");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv/config");
const url = process.env.MONGO_URL;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

var connection = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connection
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

// const storage = new GridFsStorage({
//   db: connection,
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-any-name-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}-any-name-${file.originalname}`,
//     };
//   },
// });

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
var upload = multer({ storage: storage });
app.get("/images", (req, res) => {
  images
    .find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", upload.single("img"), (req, res) => {
  var obj = { img: req.file.filename };
  images
    .create(obj)
    .then((result) => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("connected to server");
});
