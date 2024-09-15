const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFilesPath = './commands';
fs.readdir(commandFilesPath, (err, files) => {
    if (err) return console.error(`Unable to read directory ${commandFilesPath}: ${err}`);
    
    const commandFiles = files.filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        } catch (error) {
            console.error(`Error loading command ${file}: ${error}`);
        }
    }
});

const TOKEN = process.env.DISCORD_BOT_TOKEN;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
}).on('error', error => {
    console.error(`Client error: ${error}`);
});

client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(`Error executing command: ${error}`);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(TOKEN).catch(console.error);