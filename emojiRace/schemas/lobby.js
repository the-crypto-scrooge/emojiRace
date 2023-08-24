const Lobby = require('../schemas/lobbies');

const createLobby = async (callbackQuery, bot) => {
    const telegramUsername = callbackQuery.from.username;
    const numOfPlayers = callbackQuery.data.split('_')[1];

    const newLobby = new Lobby({
        creator: telegramUsername,
        maxPlayers: numOfPlayers,
        players: [telegramUsername],
        chatId: callbackQuery.message.chat.id  // Add this line to store chatId
    });

    try {
        await newLobby.save();
        bot.sendMessage(callbackQuery.message.chat.id, "Lobby created successfully!"); // Optional success message
    } catch (error) {
        console.error("Error saving or updating lobby:", error);
        bot.sendMessage(callbackQuery.message.chat.id, "Error creating lobby. Please try again."); // Notify the user
    }
};


const joinRandomLobby = async (callbackQuery, bot) => {
    const telegramUsername = callbackQuery.from.username;

    const lobby = await Lobby.findOne({
        players: { $nin: [telegramUsername] },
        isFull: false
    });

    if (lobby) {
        lobby.players.push(telegramUsername);

        if (lobby.players.length === lobby.maxPlayers) {
            lobby.isFull = true;

            // Construct the message
            const players = lobby.players.join(', '); // e.g. "@user1, @user2, @user3"
            const message = `All players have joined the lobby: ${players}\n@${lobby.creator}, start the game when ready.`;

            // Create the 'Start Game' button
            const startGameOptions = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Start Game', callback_data: `start_game_${lobby.gameId}` }]
                    ]
                }
            };
            

            // Send the message to the group
            bot.sendMessage(lobby.chatId, message, startGameOptions);


        } else {
            bot.sendMessage(callbackQuery.message.chat.id, "You have joined the lobby!");
        }

        await lobby.save();
    } else {
        bot.sendMessage(callbackQuery.message.chat.id, "No available lobbies. Consider creating one!");
    }
};

const joinLobbyById = async (callbackQuery, bot, gameId) => {
    console.log('Attempting to join lobby by ID:', gameId);  // Logging the start of the function

    const telegramUsername = callbackQuery.from.username;

    const lobby = await Lobby.findOne({
        gameId: gameId,
        players: { $nin: [telegramUsername] },
        isFull: false
    });

    if (!lobby) {
        const errorMsg = "No lobby found with that Game ID or the lobby might be full.";
        bot.sendMessage(lobby.chatId, errorMsg);

        console.log('Sent message:', errorMsg);  // Logging the sent message
        return;
    }

    lobby.players.push(telegramUsername);

    if (lobby.players.length === lobby.maxPlayers) {
        lobby.isFull = true;

        const players = lobby.players.join(', ');
        const message = `All players have joined the lobby: ${players}\n@${lobby.creator}, start the game when ready.`;

        const startGameOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Start Game', callback_data: `start_game_${lobby.gameId}` }]
                ]
            }
        };

        bot.sendMessage(callbackQuery.message.chat.id, message, startGameOptions);
        console.log('Sent message:', message);  // Logging the sent message
    } else {
        const joinMessage = `You have joined the lobby with Game ID: ${gameId}!`;
        bot.sendMessage(callbackQuery.message.chat.id, joinMessage);
        console.log('Sent message:', joinMessage);  // Logging the sent message
    }

    await lobby.save();
};

module.exports = {
    createLobby,
    joinRandomLobby,
    joinLobbyById
};
