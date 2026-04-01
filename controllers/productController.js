import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    console.log("start getting products");
    const { search = "", category = "", page = 1, limit = 8 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    let filter = {};
    if (req.user?.id) {
      filter.user = req.user.id;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }
    console.log("User:", req.user);
    console.log("filter:", filter);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category")
      .skip(skip)
      .limit(limitNumber);

    res.json({
      products,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const existing = await Product.findOne({ name, user: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Product with this name already exist" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image,
      user: req.user.id,
    });

    res.json(product);
    console.log("Creating Product:", req.body);
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
  const product = await Product.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!product) {
    return res.status(404).json({ error: "Not found or unauthorized" });
  }

  await product.deleteOne();
  res.json({ message: "Deleted" });
};

export const getAllProductsPublic = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
