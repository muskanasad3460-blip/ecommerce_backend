import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const existing = await Product.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Product with this name already exist" });
    }

    // ✅ image path
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // ✅ create product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
