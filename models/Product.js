import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: String,
    image: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
