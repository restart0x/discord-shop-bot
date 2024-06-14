# DiscordShopBot

DiscordShopBot is a Discord bot that allows users to make purchases in an online shop directly through Discord. It provides commands for browsing products, adding items to the cart, and checking out.

## Setup Instructions

1. **Install Node.js**: Ensure Node.js is installed from [nodejs.org](https://nodejs.org/).
2. **Clone the repository**: Clone this repository to your local machine.
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Set up environment variables**: Create a `.env` file in the root directory and add your Discord bot token and database connection string:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DATABASE_URI=your_database_connection_string
   ```
5. **Start the bot**:
   ```sh
   npm start
   ```

## Features

- **Product Management**: Add and view products in the shop.
- **Shopping Cart**: Add products to the cart and view the cart contents.
- **Checkout**: Complete the purchase and checkout.
