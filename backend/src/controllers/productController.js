import Product from "../models/ProductsModel.js";

export const viewProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewProductbyID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, image, description, category, stock } = req.body;
    if (!name || !price || !image || !description || !category || !stock) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }
    const product = await Product.create({ name, price, image, description, category, stock });
    return res.status(201).json(product); // 201 = Created
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProductbyID = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,         
     { returnDocument: 'after' }      
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProductbyID = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    return res.status(200).json(deletedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};