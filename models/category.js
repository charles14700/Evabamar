const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    kgs: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Category = mongoose.model("Category", categorySchema);
