const mongoose = require('mongoose');

const wageredLobbySchema = new mongoose.Schema({
    gameId: { type: String, required: true, unique: true },
    creator: { type: String, required: true },  // Telegram username of the creator
    players: { type: [String], default: [] },   // Array of Telegram usernames
    maxPlayers: { type: Number, required: true },
    isFull: { type: Boolean, default: false },
    chatId: { type: Number, required: true },

    // Additional fields for wagered lobbies:
    chosenBlockchain: { type: String, required: true },    
    currencyType: { type: String, required: true },        
    chosenCurrency: { type: String, required: true },      
    wageredAmount: { type: Number, required: true },
});

module.exports = mongoose.model('WageredLobby', wageredLobbySchema);
