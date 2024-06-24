const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const shopAPI = process.env.SHOP_API;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy one or more products from the shop.')
        .addStringOption(option => option.setName('product_id').setDescription('The ID of the product').setRequired(true))
        .addIntegerPosition(option => option.setName('quantity').setDescription('The quantity to buy').setRequired(true)),
    async execute(interaction) {
        const productId = interaction.options.getString('product_id');
        const quantity = interaction.options.getInteger('quantity');

        if(quantity < 1) {
            return interaction.reply({ content: 'Quantity must be at least 1.', ephemeral: true });
        }

        try {
            // Assuming the API can handle a batch request
            const productsToAdd = Array(quantity).fill(null).map(() => productId);
            const response = await fakeApiCallToAddMultipleToCart(shopAPI, productsToAdd);

            if(response.success) {
                const embed = new MessageEmbed()
                    .setTitle('Products Added to Cart')
                    .setDescription(`${quantity} x Product (ID: ${productId}) added to your cart.`)
                    .setColor('GREEN');

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply({ content: 'Failed to add products to cart. Please try again.', ephemeral: true });
            }
        } catch(error) {
            console.error('Error buying product: ', error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    },
};

async function fakeApiCallToAddMultipleToCart(apiUrl, productIds) {
    console.log(`API URL: ${apiUrl}, Adding products IDs: ${productIds.join(", ")}`);
    // Simulation of batch adding items to a cart, ideally, this should send a single request
    // with all product IDs and quantities to the backend which then adds all of them to the cart.
    return { success: true };
}