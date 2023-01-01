require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('strictQuery', false);

const shortUrlSchema = new mongoose.Schema({
    originUrl: { type: String, required: true },
    shortUrlId: { type: Number, unique: true }
});

module.exports = mongoose.model('shortUrl', shortUrlSchema)