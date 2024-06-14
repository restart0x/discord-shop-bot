require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const commands = {};
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', async message => {
  if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot) return;
  const args = message.content.slice(process.env.COMMAND_PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (commands[command]) {
    try {
      await commands[command](message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
  }
});
client.login(process.env.BOT_TOKEN);