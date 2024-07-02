const Discord = require('discord.js');
require('dotenv').config();
const { prefix, token } = process.env;

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"], // Specify necessary intents for your bot as per your Discord.js version
});

const formatCartItems = (items) => items.reduce((message, item) => {
  const itemCost = item.price * item.quantity;
  message += `Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity} (Cost: ${itemCost})\n`;
  return message;
}, '') + `Total Cost: ${items.reduce((total, item) => total + item.price * item.quantity, 0)}`;

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
    if (userCart.length === 0) {
      await message.channel.send('Your cart is currently empty.');
    } else {
      const cartContents = formatCartItems(userCart);
      await message.channel.send(`Here are the items in your cart:\n${cartContents}`);
    }
  }
});

client.login(token);