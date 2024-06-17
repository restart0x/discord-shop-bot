const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentTest.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const products = [
  { id: 1, name: "Gaming Laptop", price: "1500$", description: "High performance for gaming and multitasking" },
  { id: 2, name: "Wireless Mouse", price: "50$", description: "Ergonomic design with 72-hour battery life" },
];

bot.once('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!viewproducts') {
    if (products.length === 0) {
      message.channel.send('No products available.');
      return;
    }

    let replyMessage = "Here are the available products:\n\n";
    products.forEach((product) => {
      replyMessage += `**Name:** ${product.name}\n**Price:** ${product.price}\n**Description:** ${product.description}\n\n`;
    });

    message.channel.send(replyMessage);
  }
});

bot.login(process.env.DISCORD_TOKEN);