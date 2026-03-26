import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) return res.status(400).json({ error: "Already Exist" });
  const category = await Category.create({ name });
  res.json(category);
});
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});
export default router;
