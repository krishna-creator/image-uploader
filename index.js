//declaring packages
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
//declaring modules
const images = require("./model/image");
require("dotenv/config");
const app = express();
//adding middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//connecting to the database
var connection = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connection
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
//image storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
var upload = multer({ storage: storage });
//display all images by get
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
//store the image to the database
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
