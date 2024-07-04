const Discord = require('discord.js');
require('dotenv').config();
const { prefix, token } = process.env;

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"], 
});

const calculateItemCost = (item) => item.price * item.quantity;

const calculateTotalCartCost = (items) => items.reduce((total, item) => total + calculateItemCost(item), 0);

const formatCartItems = (items) => {
  let formattedItems = items.map(item => `Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity} (Cost: ${calculateItemCost(item)})`);
  formattedItems.push(`Total Cost: ${calculateTotalCartCost(items)}`); 
  return formattedItems.join('\n');
};

let userCart = [
  { name: 'Item1', price: 10, quantity: 2 },
  { name: 'Item2', price: 20, quantity: 1 },
];

client.once('ready', () => {
  console.log('DiscordShopBot is online!');
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'viewcart') {
    showMessage(message);
  }
});

async function showMessage(message) {
  if (userCart.length === 0) {
    await message.channel.send('Your cart is currently empty.');
  } else {
    const cartContents = formatCartItems(userCart);
    await message.channel.send(`Here are the items in your cart:\n${cartContents}`);
  }
}

client.login(token);