const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const shopAPI = process.env.SHOP_API;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy one or more products from the shop.')
        .addStringOption(option => 
            option.setName('product_id')
            .setDescription('The ID of the product')
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName('quantity')
            .setDescription('The quantity to buy')
            .setRequired(true)),
    async execute(interaction) {
        const productId = interaction.options.getString('product_id');
        const quantity = interaction.options.getInteger('quantity');

        if (!isValidQuantity(quantity)) {
            await interaction.reply({ content: 'Quantity must be at least 1.', ephemeral: true });
            return;
        }

        try {
            const response = await addItemToCart(shopAPI, productId, quantity);

            if (response.success) {
                await replyWithSuccess(interaction, productId, quantity);
            } else {
                await replyWithFailure(interaction, 'Failed to add products to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error buying product: ', error);
            await replyWithFailure(interaction, 'An error occurred while processing your request.');
        }
    },
};

function isValidQuantity(quantity) {
    return quantity >= 1;
}

async function addItemToCart(apiUrl, productId, quantity) {
    const productsToAdd = Array(quantity).fill(productId);
    console.log(`API URL: ${apinUrl}, Adding products IDs: ${productsToAdd.join(", ")}`);
    // This function should contain the logic for adding items to a user's shopping cart.
    // For demonstration purposes, it always returns success.
    return { success: true };
}

async function replyWithSuccess(interaction, productId, quantity) {
    const embed = new MessageEmbed()
        .setTitle('Products Added to Cart')
        .setDescription(`${quantity} x Product (ID: ${productId}) added to your cart.`)
        .setColor('GREEN');
    await interaction.reply({ embeds: [embed] });
}

async function replyWithFailure(interaction, message) {
    await interaction.reply({ content: message, ephemeral: true });
}