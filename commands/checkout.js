const { Client, Intents, MessageActionRow, MessageSelectMenu } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
    console.log('DiscordShopBot is online!');
});

bot.on('messageCreate', async message => {
    if (message.content === '!checkout') {
        const products = JSON.parse(process.env.STRIPE_PRICE_IDS);
        const row = new MessageActionRow().addComponents(new MessageSelectMenu({
            customId: 'select-product',
            placeholder: 'Select a product...',
            options: products.map(product => ({
                label: product.name,
                value: product.id,
            })),
        }));

        message.reply({
            content: "Please select a product to checkout:",
            components: [row]
        });
    }
});

bot.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'select-product') {
        try {
            const selectedProductId = interaction.values[0];

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: selectedProductId,
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://example.com/cancel',
            });

            await interaction.reply(`To complete your purchase, please click here: ${session.url}`);
        } catch (error) {
            console.error('Checkout failed:', error);
            interaction.reply('Sorry, there was an error processing your payment. Please try again later.');
        }
    }
});