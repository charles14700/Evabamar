const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    brand: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
