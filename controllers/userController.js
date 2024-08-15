const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const usersFilePath = path.join(__dirname, 'users.json');

let usersData = {};
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({}, null, 2), 'utf8');
} else {
  usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

function getUserInfo(userId) {
  return usersData[userId] || null;
}

function updateUserInfo(userId, newUserInfo) {
  usersData[userId] = { ...usersData[userId], ...newUserInfo };
  saveUsersDataDebounced();
}

let saveTimeout = null;
function saveUsersData() {
  fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf8');
}
function saveUsersDataDebounced() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(saveUsersData, 5000);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.content.startsWith('!getuserinfo')) {
    const userId = message.author.id;
    const userInfo = getUserInfo(userId);
    if (userInfo) {
      message.channel.send(`User info: ${JSON.stringify(userInfo)}`);
    } else {
      message.channel.send('User info not found.');
    }
  }

  if (message.content.startsWith('!updateuserinfo')) {
    const userId = message.author.id;
    const newUserInfo = { lastUpdate: new Date().toISOString() };
    updateUserInfo(userId, newUserInfo);
    message.channel.send('User info updated.');
  }
});

process.on('exit', () => {
  saveUsersData();
});

client.login(process.env.DISCORD_BOT_TOKEN);