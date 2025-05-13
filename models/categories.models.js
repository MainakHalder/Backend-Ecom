const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["electronics", "clothing", "household"],
    required: true,
  },
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
