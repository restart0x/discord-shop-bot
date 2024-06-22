const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const shopAPI = process.env.SHOP_API;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy a product from the shop.')
        .addStringOption(option => option.setName('product_id').setDescription('The ID of the product').setRequired(true))
        .addIntegerOption(option => option.setName('quantity').setDescription('The quantity to buy').setRequired(true)),
    async execute(interaction) {
        const productId = interaction.options.getString('product_id');
        const quantity = interaction.options.getInteger('quantity');

        if(quantity < 1) {
            return interaction.reply({ content: 'Quantity must be at least 1.', ephemeral: true });
        }

        try {
            const response = await fakeApiCallToAddToCart(shopAPI, productId, quantity);
            
            if(response.success) {
                const embed = new MessageEmbed()
                    .setTitle('Product Added to Cart')
                    .setDescription(`${quantity} x Product (ID: ${productId}) added to your cart.`)
                    .setColor('GREEN');

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: 'Failed to add product to cart. Please try again.', ephemeral: true });
            }
        } catch(error) {
            console.error('Error buying product: ', error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};

async function fakeApiCallToAddToCart(apiUrl, productId, quantity) {
    console.log(`API URL: ${apiUrl}, Adding product ID: ${productId}, Quantity: ${quantity}`);
    return { success: true };
}