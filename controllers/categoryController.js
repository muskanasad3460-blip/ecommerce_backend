import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ error: "Already exist" });
    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Somethimg wrong" });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCategory = Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json(updateCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
};
