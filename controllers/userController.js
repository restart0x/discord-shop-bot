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

let usersData = loadUsersData();

function loadUsersData() {
    if (fs.existsSync(usersFilePath)) {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    }
    return {};
}

function getUserInfo(userId) {
  return usersData[userId] || null;
}

function updateUserInfo(userId, newUserInfo) {
  usersData[userId] = { ...usersData[userId], ...newUserInfo };
  saveUsersDataDebounced();
}

let saveTimeout = null;
function saveUsersDataDebounced() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf8');
  }, 5000);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.content.startsWith('!getuserinfo')) {
    const userId = message.author.id;
    const userInfo = getUserInfo(userId);
    message.channel.send(userInfo ? `User info: ${JSON.stringify(userInfo)}` : 'User info not found.');
  }

  if (message.content.startsWith('!updateuserinfo')) {
    const userId = message.author.id;
    updateUserInfo(userId, { lastUpdate: new Date().toISOString() });
    message.channel.send('User info updated.');
  }
});

process.on('exit', () => {
  fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf8');
});

client.login(process.env.DISCORD_BOT_TOKEN);