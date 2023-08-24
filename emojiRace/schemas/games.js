const mongoose = require('mongoose');

const playerDetailsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    ethereumAddress: { 
        type: String, 
    },
    
    // ... any other player related data
});

// Define the wageredLobbySchema as a subdocument
const wageredLobbySchema = new mongoose.Schema({
    isWageredGame: { type: Boolean, default: false },
    chosenBlockchain: { type: String, required: true },
    currencyType: { type: String, required: true },
    chosenCurrency: { type: String, required: true },
    wageredAmount: { type: Number, required: true },
});

const gameSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    chatId: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: ['waiting', 'in-progress', 'completed'],
        default: 'waiting'
    },
    currentPlayerIndex: {   // Index of the current player in the 'players' array
        type: Number,
        default: 0
    },
    
    isFinished: {
        type: Boolean,
        default: false
    },
    players: [playerDetailsSchema], 
    wageredLobby: wageredLobbySchema,
}, { versionKey: false });

gameSchema.pre('save', function(next) {
    // 'this' refers to the game instance being saved.
    if (!this._id) { // If the document is new and doesn't have an _id yet
        this.gameId = this._id; // Assign the automatically generated _id to gameId
    }
    next(); // Move to the next middleware or save operation
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
