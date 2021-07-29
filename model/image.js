var mongoose = require("mongoose");
var schema = mongoose.Schema;

var imageschema = new schema(
  {
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("image", imageschema);
