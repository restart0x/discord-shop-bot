const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = process.env.MONGO_DB_CONNECTION;

function connectToMongoDB() {
    mongoose.connect(dbConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connection established.'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        setTimeout(connectToMongoDB, 5000);
    });
}

connectToMongoDB();

mongoose.connection.on('error', err => {
    console.error('MongoDB encountered an error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection lost. Attempting to reconnect...');
    connectToMongoDB();
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    discordId: {
        type: String,
        required: [true, 'Discord ID is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.methods.doSomething = function() {};

const User = mongoose.model('User', userStack);

module.exports = User;