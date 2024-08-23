const fs = require('fs');
require('dotenv').config();

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  viewCart() {
    return this.items;
  }

  checkout() {
    const total = this.items.reduce((acc, item) => acc + item.price, 0);
    const cartContents = {
      items: this.items,
      total: total,
    };

    fs.writeFileSync(process.env.CART_FILE_PATH, JSON.stringify(cartContents, null, 2));
    console.log('Checkout successful, your cart has been saved.');
  }
}

const userCart = new Cart();

function addToCart(item) {
  userCart.addItem(item);
  console.log(`${item.name} added to the cart.`);
}

function viewCart() {
  console.log('Cart contents:', userCart.viewCart());
}

function checkout() {
  userCart.checkout();
}

module.exports = {
  addToCart,
  viewCart,
  checkout,
};