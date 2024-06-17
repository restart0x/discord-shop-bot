require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const commands = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (shouldIgnoreMessage(message)) return;
  
  const { command, args } = parseMessage(message);

  if (command in commands) {
    executeCommand(command, message, args);
  }
});

client.login(process.env.BOT_TOKEN);

function shouldIgnoreMessage(message) {
  return !message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot;
}

function parseMessage(message) {
  const args = message.content.slice(process.env.COMMAND_PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  return { command, args };
}

async function executeCommand(command, message, args) {
  try {
    await commands[command](message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
}