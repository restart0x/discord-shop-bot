require('dotenv').config();
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  totalCost: {
    type: Number,
    required: true,
  }
});

// Logging function integrated within the schema
function logChange(doc) {
  console.log(`Cart updated for user: ${doc.userId} at ${new Date().toLocaleString()}`);
}

// Post-save middleware to log when a cart is saved
cartSchema.post('save', function(doc) {
  logChange(doc);
});

module.exports = mongoose.model('Cart', cartSchema);