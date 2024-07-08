const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
    console.log('DiscordShopBot is online!');
});

bot.on('messageCreate', async message => {
    if (message.content === '!checkout') {
        try {
            const priceId = process.env.STRIPE_PRICE_ID;

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: priceId,
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://example.com/cancel',
            });

            message.reply(`To complete your purchase, please click here: ${session.url}`);
        } catch (error) {
            console.error('Checkout failed:', error);
            message.reply('Sorry, there was an error processing your payment. Please try again later.');
        }
    }
});