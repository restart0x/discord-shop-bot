const mongoose = require('mongoose');
require('dotenv').config();
const dbConnection = process.env.MONGO_DB_CONNECTION;
mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connection established.'))
.catch(err => console.error('MongoDB connection error:', err));
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
const User = mongoose.model('User', userSchema);
module.exports = User;