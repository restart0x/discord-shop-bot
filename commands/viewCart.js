const Discord = require('discord.js');
require('dotenv').config();
const { prefix, token } = process.env;

const client = new Discord.Client();

function formatCartItems(items) {
  let message = '';
  let totalCost = 0;
  items.forEach(item => {
    message += `Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}\n`;
    totalCost += item.price * item.quantity;
  });
  message += `Total Cost: ${totalCost}`;
  return message;
}

let userCart = [
  { name: 'Item1', price: 10, quantity: 2 },
  { name: 'Item2', price: 20, quantity: 1 }
];

client.once('ready', () => {
  console.log('DiscordShopBot is online!');
});

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'viewcart') {
    if (userCart.length === 0) {
      message.channel.send('Your cart is currently empty.');
    } else {
      const cartContents = formatCartItems(userCart);
      message.channel.send(`Here are the items in your cart:\n${cartContents}`);
    }
  }
});

client.login(token);