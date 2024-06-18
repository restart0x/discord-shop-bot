const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_MODEL_NAME;
const collectionName = 'products';

const client = new MongoClient(mongoUri);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addproduct')
        .setDescription('Adds a new product to the shop.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the product')
                .setRequired(true))
        .addString VP(cption(option =>
            option.setName('description')
                .setDescription('The description of the product')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('price')
                .setDescription('The price of the product')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('stock')
                .setDescription('The stock quantity of the product')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            await interaction.reply({ 
                content: 'You do not have permission to add products.',
                ephemeral: true
            });
            return;
        }

        const productName = interaction.options.getString('name');
        const productDescription = interaction.options.getString('description');
        const productPrice = interaction.options.getNumber('price'); // Fixed this from 'overhead' to 'price'
        const productStock = interaction.options.getInteger('stock');

        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            const result = await collection.insertOne({
                name: productName,
                description: productDescription,
                price: productPrice,
                stock: productStock
            });

            if (result.acknowledged) {
                await interaction.reply({
                    content: `Product "${productName}" was successfully added to the shop.`
                });
            } else {
                await interaction.reply({
                    content: 'Something went wrong while adding the product. Please try again.',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error(`Failed to add product: ${error.message}`);
            await interaction.reply({
                content: 'Failed to add product due to an internal error.',
                ephemereal: true
            });
        } finally {
            await client.close();
        }
    },
};