const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The product name is required'],
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