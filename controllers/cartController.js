const fs = require('fs');
require('dotenv').config();

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    try {
      this.items.push(item);
      console.log(`${item.name} added to the cart.`);
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  }

  viewCart() {
    return this.items;
  }

  checkout() {
    try {
      const total = this.items.reduce((acc, item) => acc + item.price, 0);
      const cartContents = {
        items: this.items,
        total,
      };
      
      fs.writeFileSync(process.env.CART_FILE_PATH, JSON.stringify(cartContents, null, 2));
      console.log('Checkout successful, your cart has been saved.');
    } catch (error) {
      console.error('Checkout failed: ', error);
    }
  }
}

async function fetchItemsDetails(itemIds) {
  return itemIds.map(id => ({
    id,
    name: `Item ${id}`,
    price: Math.floor(Math.random() * 100 + 1)
  }));
}

const userCart = new Cart();

async function addToCart(itemIds) {
  try {
    const items = await fetchItemsDetails(itemIds);
    items.forEach(item => userCart.addItem(item));
  } catch (error) {
    console.error('Failed to add items to cart:', error);
  }
}

function viewCart() {
  try {
    const cart = userCart.viewCart();
    if (cart.length === 0) {
      console.log('Your cart is empty.');
    } else {
      console.log('Cart contents:', cart);
    }
  } catch (error) {
    console.error('Failed to view cart:', error);
  }
}

function checkout() {
  try {
    userCart.checkout();
  } catch (error) {
    console.error('Checkout process failed:', error);
  }
}

module.exports = {
  addToCart,
  viewCart,
  checkout,
};