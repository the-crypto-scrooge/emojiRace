// This file is responsible for handling the in game player data such as control meter, influence meter, districts claimed, etc...



const mongoose = require('mongoose');

// Player Schema Definition
const playerSchema = new mongoose.Schema({
  telegramUsername: { type: String, required: true, unique: true },
  // Additional fields can be added here
});

const PlayerModel = mongoose.model('Player', playerSchema);