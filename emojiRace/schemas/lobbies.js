const mongoose = require('mongoose');

const lobbySchema = new mongoose.Schema({
    gameId: {type: String, required: true, unique: true},
    creator: { type: String, required: true },   // Telegram username of the creator
    players: { type: [String], default: [] },     // Array of Telegram usernames
    maxPlayers: { type: Number, required: true },
    isFull: { type: Boolean, default: false },
    chatId: { type: Number, required: true },
});


module.exports = mongoose.model('Lobby', lobbySchema);

