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
        console.error('Failed to connect to MongoDB:', err);
        setTimeout(connectToMongoDB, 5000); // Retry connection after 5 seconds
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

userSchema.methods.doSomething = function() {
    // Example function content
};

const User = mongoose.model('User', userSchema); 

module.exports = User;

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

mongoose.connection.on('reconnected', () => {
    console.log('Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
    console.log('Connection Disconnected');
});

mongoose.connection.on('close', () => {
    console.log('Connection Closed');
});

mongoose.connection.on('error', (error) => {
    console.log('ERROR: ' + error);
});

const handleExit = (signal) => {
    console.log(`Received ${signal}. Close my server properly.`);
    mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected due to application termination');
        process.exit(0);
    });
};

process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);