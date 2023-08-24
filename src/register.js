const User = require('./user');

const registerUser = async (callbackQuery, bot, showWelcomeMenu) => {
    const telegramUsername = callbackQuery.from.username;
    const chatId = callbackQuery.message.chat.id;

    // Check if the Telegram user has set a username
    if (!telegramUsername) {
        bot.sendMessage(chatId, "Please set your username in Telegram settings before registering.", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Go to Settings", url: "tg://settings" }]
                ]
            }
        });
        return;
    }

    // Check if the user has already registered
    const userExists = await User.findOne({ telegramUsername: telegramUsername });

    if (userExists) {
        bot.sendMessage(chatId, "You're already registered!");
    } else {
        // Save the user to the database
        const newUser = new User({
            telegramUsername: telegramUsername,
        });
        await newUser.save();

        bot.sendMessage(chatId, "Registration successful! Welcome to the Mayhem Game!");
        showWelcomeMenu(chatId, telegramUsername, bot);
    }
};

module.exports = registerUser;
