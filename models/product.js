const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The product name is required'],
    unique: [true, 'Product name must be unique'], // Unique constraint added
  },
  description: {
    type: String,
    required: [true, 'The product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'The product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  stock: {
    type: Number,
    required: [true, 'The product stock is required'],
    min: [0, 'Stock cannot be negative'],
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

const express = require('express');
const router = express.Router();
const Product = require('./path/to/your/Product');

router.post('/add-product', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).send({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: "Validation Error", details: error.message });
    } else if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).send({ message: "Product name must be unique", details: error.keyValue });
    } else {
      return res.status(500).send({ message: "Internal Server Error", error: error });
    }
  }
});