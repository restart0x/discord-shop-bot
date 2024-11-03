const fs = require('fs');
require('dotenv').config();

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
    console.log(`${item.name} added to the cart.`);
  }

  viewCart() {
    return this.items;
  }

  checkout() {
    const total = this.items.reduce((acc, item) => acc + item.price, 0);
    const cartContents = {
      items: this.items,
      total,
    };
    
    fs.writeFileSync(process.env.CART_FILE_PATH, JSON.stringify(cartContents, null, 2));
    console.log('Checkout successful, your cart has been saved.');
  }
}

async function fetchItemsDetails(itemIds = []) {
  return itemIds.map(id => ({
    id,
    name: `Item ${id}`,
    price: Math.floor(Math.random() * 100 + 1)
  }));
}

const userCart = new Cart();

async function addToCart(itemIds) {
  const items = await fetchItemsDetails(itemIds);
  items.forEach(item => userCart.addItem(item));
}

function viewCart() {
  const cart = userCart.viewCart();
  if (cart.length === 0) {
    console.log('Your cart is empty.');
  } else {
    console.log('Cart contents:', cart);
  }
}

function checkout() {
  userCart.checkout();
}

module.exports = {
  addToCart,
  viewCart,
  checkout,
};