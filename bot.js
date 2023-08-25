require('dotenv').config();

const contractAddress = '0x7791a46Cb94B2Da7152e579e6b5172003dDe49db';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"}],"name":"TokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WinnerPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"addAllowedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"}],"name":"deductPlayerWagers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"winningsAmount","type":"uint256"},{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"}],"name":"handleGameResults","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"winningsAmount","type":"uint256"},{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"}],"name":"handleGameResultsERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const HOUSE_ADDRESS = '0x66d2A849850C26D95396B83EC0D644888ef52da4';
const TelegramBot = require('node-telegram-bot-api');
const Database = require('./src/db');
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const ethers = require('ethers'); // You might not need ethers if you're only using web3
const Web3 = require('web3');
const mongoose = require('mongoose');

const SENDER_ADDRESS = process.env.SENDER_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const web3 = new Web3.Web3(process.env.GOERLI_INFURA_URL);

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_INFURA_URL);
const ethersWallet = new ethers.Wallet('0x' + PRIVATE_KEY).connect(provider);
const ethersContract = new ethers.Contract(contractAddress, contractABI, ethersWallet);
console.log(ethersWallet.address);

const contract = new web3.eth.Contract(contractABI, contractAddress);

const registerUser = require('./src/register');
const User = require('./src/user');

// Schemas
const Game = require('./schemas/games');
const Lobby = require('./schemas/lobbies');
const WageredLobby = require('./schemas/wageredLobbies');
const FreeGame = require('./schemas/freeGame');

let tempWageredLobbyDetails = {};


// Controllers


const awaitingEmoji = {};
const { v4: uuidv4 } = require('uuid');


async function canJoinLobby(telegramUsername) {
    // Search for games where this player is a participant and the game hasn't finished
    const existingGames = await Game.find({ 
        'players.username': telegramUsername,
        isFinished: false 
    });

    // If any such games are found, the player cannot join a lobby
    return existingGames.length === 0;
}

async function distributeWinnings(game, winnerUsername) {
    const wageredAmountWei = ethers.utils.parseEther(game.wageredLobby.wageredAmount.toString());
    const totalWagersWei = wageredAmountWei.mul(game.players.length);
    const winningsAmountWei = totalWagersWei.mul(9).div(10);

    const houseAddress = '0x0FE31BC3cED8a31332d6087408381a1221147a2B'; 
    const houseAmount = totalWagersWei.sub(winningsAmountWei);

    const winner = await User.findOne({ telegramUsername: winnerUsername });
    const winnerAddress = winner.ethereumAddress;

    const playersAddresses = await Promise.all(game.players.map(async playerData => {
        const player = await User.findOne({ telegramUsername: playerData.username });
        return player.ethereumAddress;
    }));
    
    const wagersWeiArray = new Array(game.players.length).fill(wageredAmountWei.toString());

    // 25% chance for an NFT to be sent out
    let nftRecipient = '0x0000000000000000000000000000000000000000'; // default no NFT
    let nftTokenId = 0; // default no NFT
    const nftQuantity = 1;

    if (Math.random() <= 0.25) {
        // Check available NFTs in the contract
        let availableNFTs = [];
        for (let i = 1; i <= 28; i++) {
            const quantity = await ethersContract.getNFTQuantity(i);
            if (quantity > 0) {
                availableNFTs.push(i);
            }
        }
        
        // If there are available NFTs, randomly select one
        if (availableNFTs.length > 0) {
            nftTokenId = availableNFTs[Math.floor(Math.random() * availableNFTs.length)];
            
            // Randomly select a player to receive the NFT
            const randomIndex = Math.floor(Math.random() * game.players.length);
            nftRecipient = playersAddresses[randomIndex];
        }
    }

    try {
        // Handle winner's winnings
        const winnerTxResponse = await ethersContract.handleGameResults(
            winnerAddress,
            winningsAmountWei.toString(),
            playersAddresses,
            wagersWeiArray,
            nftRecipient,
            nftTokenId,
            nftQuantity
        );
        console.log('Winner Transaction hash:', winnerTxResponse.hash);
        
        const winnerReceipt = await winnerTxResponse.wait();
        console.log('Winner Transaction was mined in block:', winnerReceipt.blockNumber);
        
        // Handle house's share
        const houseTxResponse = await ethersContract.handleGameResults(
            houseAddress,
            houseAmount.toString(),
            playersAddresses,
            wagersWeiArray,
            '0x0000000000000000000000000000000000000000',  // No NFT for the house
            0,  // No NFT for the house
            0   // No NFT for the house
        );
        console.log('House Transaction hash:', houseTxResponse.hash);

        const houseReceipt = await houseTxResponse.wait();
        console.log('House Transaction was mined in block:', houseReceipt.blockNumber);

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

async function startWageredGame(callbackQuery, bot) {
    console.log("Inside startWageredGame function");

    const chatId = callbackQuery.message.chat.id;
    const lobbyIdFromCallback = callbackQuery.data.split('_')[3];

    console.log("Fetching wagered lobby with ID:", lobbyIdFromCallback);

    const lobby = await WageredLobby.findOne({ _id: lobbyIdFromCallback });

    if (!lobby) {
        console.error("Lobby not found with ID:", lobbyIdFromCallback);
        bot.sendMessage(chatId, "Error finding the wagered lobby. Please try again later.");
        return;
    }

    console.log("Found lobby:", lobby);
    bot.sendMessage(chatId, "Creating a wagered game, please wait...")

    // Convert wagered amount to Wei
    const wageredAmountWei = ethers.utils.parseEther(lobby.wageredAmount.toString());

    // Fetch Ethereum addresses of all players in the lobby
    const playersAddresses = await Promise.all(lobby.players.map(async username => {
        const player = await User.findOne({ telegramUsername: username });
        return player.ethereumAddress;
    }));

    // Check each player's balance
    for (let i = 0; i < playersAddresses.length; i++) {
        const ethBalance = await contract.methods.ethBalances(playersAddresses[i]).call();
        const ethBalanceInEther = web3.utils.fromWei(ethBalance, 'ether');
        
        if (parseFloat(ethBalanceInEther) < parseFloat(lobby.wageredAmount)) {
            bot.sendMessage(chatId, `Player ${lobby.players[i]} does not have the required funds to start a game. Please increase your balance or leave the lobby.`);
            return; // Exit function if any player doesn't have the required funds
        }
    }

    // Deduct the wagers from players' balances
    const wagersWeiArray = new Array(lobby.players.length).fill(wageredAmountWei.toString());

    try {
        const deductTxResponse = await ethersContract.deductPlayerWagers(playersAddresses, wagersWeiArray);
        console.log('Deduction Transaction hash:', deductTxResponse.hash);

        const deductReceipt = await deductTxResponse.wait();
        console.log('Deduction Transaction was mined in block:', deductReceipt.blockNumber);
    } catch (error) {
        console.error("Error deducting wagers:", error);
        bot.sendMessage(chatId, "Error starting the game due to wager deduction. Please try again later.");
        return;
    }

    // Shuffle the player order
    const shuffledPlayers = [...lobby.players].sort(() => Math.random() - 0.5);

    console.log("Shuffled players:", shuffledPlayers);

    let newGame;
    try {
        // Initialize districts for the game
        const availableDistricts = await initializeDistrictsForGame(shuffledPlayers.length);
        console.log("Available districts:", availableDistricts);
        
        // Fetch initial resource values from Resources collection
        const defaultResources = await Resources.findOne({});
        console.log("Default resources:", defaultResources);

        // Create a new game using the shuffled player order
        newGame = new Game({
            chatId: lobby.chatId,
            players: shuffledPlayers.map(username => ({
                username,
                controlMeter: 5,
                influenceMeter: 5,
                money: defaultResources.money.value,
                supporters: defaultResources.supporters.value,
                weapons: defaultResources.weapons.value
            })),
            availableDistricts: availableDistricts,
            state: 'in-progress',
            wageredLobby: {
                isWageredGame: true,
                chosenBlockchain: lobby.chosenBlockchain,
                currencyType: lobby.currencyType,
                chosenCurrency: lobby.chosenCurrency,
                wageredAmount: lobby.wageredAmount,
                nftReward: lobby.nftReward,
            }
        });

        await newGame.save();
        console.log("New game saved:", newGame);

        // After saving, set gameId to _id
        newGame.gameId = newGame._id;
        await newGame.save();

        console.log("New game after saving:", newGame);

        // Remove the wagered lobby
        await WageredLobby.deleteOne({ _id: lobbyIdFromCallback });
        console.log("Wagered lobby removed.");

        const gameIntroMessage = `
⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️

_The city is a battleground, 
and you're in the fray. 
Bribery, alliances, and cunning 
will shape your destiny.
But remember, the Commissioner 
is always one step ahead._

_Welcome to the_

*Streets of Mayhem*

⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️🚓⚠️
`;

        bot.sendMessage(chatId, gameIntroMessage, { parse_mode: 'Markdown' });

        // Prompt the first player for their turn after a delay
        setTimeout(() => promptPlayerTurn(bot, newGame._id), 2000);
        console.log("Prompting player turn.");

        return newGame; // Return the created game instance

    } catch (error) {
        console.error("Error starting the wagered game:", error);
        bot.sendMessage(chatId, "Error starting the game. Please try again later.");
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function isUserRegistered(telegramUsername) {
    const isRegistered = await User.findOne({ telegramUsername: telegramUsername });
    return isRegistered != null;
}

// Function to prompt user to register
function promptUserToRegister(chatId, bot) {
    const registerText = "You are not registered. Please register to continue.";
    const registerOptions = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Register', callback_data: 'register' }]
            ],
        },
        parse_mode: 'Markdown'
    };

    bot.sendMessage(chatId, registerText, registerOptions);
}

// Helper function to validate Ethereum address
function isValidEthereumAddress(address) {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
}

// Helper function to process the result and take the appropriate action
function processBotResult(result, bot) {
    if (!result || !result.type) return;

    switch (result.type) {
        case 'editMessage':
        case 'editMessageText':    
            bot.editMessageText(result.text, {
                chat_id: result.chatId,
                message_id: result.messageId,
                ...result.options
            });
            break;
        case 'sendMessage':
            bot.sendMessage(result.chatId, result.text, result.options);
            break;
        case 'editMessageReplyMarkup':
            bot.editMessageReplyMarkup(result.options, {
                chat_id: result.chatId,
                message_id: result.messageId
            });
            break;
        // Add more cases if there are other types of results to handle
        default:
            console.error('Unknown result type:', result.type);
    }
}

// Handle setting up the wallet
async function handleWalletSetup(chatId, telegramUsername, bot) {
    // Check if user is registered
    const user = await User.findOne({ telegramUsername: telegramUsername });

    if (!user) {
        return bot.sendMessage(chatId, "Please register before setting up your wallet.");
    }

    const promptForAddress = async (error = false) => {
        if (error) {
            bot.sendMessage(chatId, "That doesn't look like a valid Ethereum address. Please try again.");
        }
    
        bot.sendMessage(chatId, "Please enter your Ethereum address.").then(() => {
            bot.once('message', async (msg) => {
                const address = msg.text;
    
                // Check if the Ethereum address is already registered
                const existingUser = await User.findOne({ ethereumAddress: address });
                if (existingUser && existingUser.telegramUsername !== telegramUsername) {
                    bot.sendMessage(chatId, "This Ethereum address is already registered by another user. Please provide a different address.");
                    return promptForAddress(true);
                }
    
                if (!isValidEthereumAddress(address)) {
                    // Prompt again for a valid Ethereum address with an error message
                    promptForAddress(true);
                } else {
                    // Update the user's Ethereum address in the database
                    user.ethereumAddress = address;
                    await user.save();
    
                    bot.sendMessage(chatId, "Your Ethereum address has been successfully registered! You can now participate in wagered games.");
                }
            });
        });
    }
    
    promptForAddress();
}

async function showWelcomeMenu(chatId, telegramUsername, bot) {
    // Check if user is registered
    const isRegistered = await User.findOne({ telegramUsername: telegramUsername });

    const welcomeText = `
🏁 *Welcome to Emoji Race!* 🏁

Step into the thrilling world of emoji racing where you can wager, race, and win! Emoji Race is a unique blend of fun and crypto, allowing you to experience the thrill of racing while potentially earning rewards.

💎 *About Emoji Race:* 
Choose your favorite emoji, place your wager, and watch as emojis race to the finish line. Will your chosen emoji emerge victorious?

🎮 Ready to dive into the race? Choose from the options below:
`;
    
    let mainMenuButtons = [];
    
    if (isRegistered) {
        mainMenuButtons.push([{ text: '🏁 Start Race', callback_data: 'start_race' }]);
        
        // Check if the user has set up an Ethereum address
        if (!isRegistered.ethereumAddress) {
            mainMenuButtons.push([{ text: '🔗 Setup Wallet', callback_data: 'setup_wallet' }]);
        }
        
    } else {
        mainMenuButtons.push([{ text: '📝 Register', callback_data: 'register' }]);
    }
    
    const mainMenuOptions = {
        reply_markup: {
            inline_keyboard: mainMenuButtons,
        },
        parse_mode: 'Markdown'
    };
    
    bot.sendMessage(chatId, welcomeText, mainMenuOptions);
    
}

async function checkBalanceAndWagerEthEth(chatId, chosenAmount, telegramUsername, bot, callbackQuery) {
    try {
        // Fetch user's Ethereum address from the database
        const user = await User.findOne({ telegramUsername: telegramUsername });
        if (!user || !user.ethereumAddress) {
            bot.sendMessage(chatId, 'Your crypto address is not registered. Please DM the bot with the start command to set it up.');
            return;
        }

        const userAddress = user.ethereumAddress;

        // Get ETH balance
        const ethBalance = await contract.methods.ethBalances(userAddress).call();
        const ethBalanceInEther = web3.utils.fromWei(ethBalance, 'ether');

        if (parseFloat(ethBalanceInEther) < parseFloat(chosenAmount)) {
            bot.sendMessage(chatId, `Insufficient balance. You wagered ${chosenAmount} ETH but your balance is ${ethBalanceInEther} ETH.`);
            return;
        }

        // Extract numOfPlayers from callbackQuery
        const callbackDataParts = callbackQuery.data.split('_');

        // Added log statements for debugging
        console.log("Full callbackQuery.data string:", callbackQuery.data);
        console.log("Split parts of callbackQuery.data:", callbackDataParts);

        const numOfPlayers = Number(callbackDataParts[4]);
        console.log("[checkBalanceAndWagerEthEth] Extracted numOfPlayers (which will be maxPlayers in the lobby):", numOfPlayers);

        // Log for debugging
        console.log("Extracted callback data parts:", callbackDataParts);
        console.log("Extracted number of players:", numOfPlayers);

        // Check for NaN
        if (isNaN(numOfPlayers)) {
            console.error("Invalid number of players extracted:", numOfPlayers);
            bot.sendMessage(chatId, 'Sorry, there was an error processing your request. Please try again.');
            return;
        }

        console.log("[checkBalanceAndWagerEthEth] Setting awaitingEmoji with numOfPlayers (maxPlayers for lobby):", numOfPlayers);

        // Store the user's details in the awaitingEmoji object for later processing
        awaitingEmoji[chatId] = {
            wageredAmount: chosenAmount,
            numOfPlayers: numOfPlayers,
            username: telegramUsername
        };

        console.log("[checkBalanceAndWagerEthEth] Current awaitingEmoji object:", JSON.stringify(awaitingEmoji));

    } catch (error) {
        console.error('Error checking wager against balance:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error checking your wager against your balance.');
    }
}

async function handleWageredLobbyChoiceEthEth(details, bot) {
    const { wageredAmount, numOfPlayers, emoji, chatId, username } = details;

    console.log("[handleWageredLobbyChoiceEthEth] Received details with numOfPlayers (maxPlayers for lobby):", numOfPlayers);

    const canJoin = await canJoinLobby(username);
    if (!canJoin) {
        bot.sendMessage(chatId, "You are already in an ongoing game. Finish it before joining or creating a new wagered lobby!");
        return;
    }

    const existingLobby = await WageredLobby.findOne({ "players.username": username, isFull: false });

    if (existingLobby) {
        bot.sendMessage(chatId, "You are already in a wagered lobby. Please leave your current lobby before creating a new one.");
        return;
    }

    const user = await User.findOne({ telegramUsername: username });
    if (!user) {
        bot.sendMessage(chatId, `Unable to locate user in database. Please ensure you're registered.`);
        return;
    }

    console.log("[handleWageredLobbyChoiceEthEth] Creating new WageredLobby with maxPlayers:", numOfPlayers);

    const newWageredLobby = new WageredLobby({
        players: [{ username: username, emoji: emoji }],
        maxPlayers: numOfPlayers,
        creator: username,
        chatId: chatId,
        gameId: new mongoose.Types.ObjectId().toString(),
        chosenBlockchain: 'ETH',
        currencyType: 'ETH',
        chosenCurrency: 'ETH',
        wageredAmount: wageredAmount,
        ethereumAddress: user.ethereumAddress
    });

    try {
        await newWageredLobby.save();
        // Create an inline keyboard button to join the wagered lobby
        const joinButton = {
            text: `Join ${wageredAmount.toFixed(4)} lobby`,
            callback_data: `select_eth_lobby_${newWageredLobby._id}`
        };
        const opts = {
            reply_markup: {
                inline_keyboard: [[joinButton]]
            }
        };

        bot.sendMessage(chatId, `Wagered lobby for ${numOfPlayers} players created! \nWaiting for others to join...`, opts);
    } catch (error) {
        console.error("Error saving or updating wagered lobby:", error);
        bot.sendMessage(chatId, `An error occurred while creating the wagered lobby. Please try again later.`);
    }
}





function fetchAvailableEthLobbies(chatId) {
    WageredLobby.find({ isFull: false, chosenBlockchain: 'ETH' })
    .then(lobbies => {
        if (!lobbies || lobbies.length === 0) {
            bot.sendMessage(chatId, "No available ETH lobbies to join at the moment.");
            return;
        }

        const lobbyButtons = lobbies.map(lobby => [{
            text: `${lobby.creator}'s Lobby`,
            callback_data: `select_eth_lobby_${lobby._id}`
        }]);

        const options = {
            reply_markup: {
                inline_keyboard: lobbyButtons
            }
        };

        bot.sendMessage(chatId, "Choose a ETH lobby to join:", options);
    })
    .catch(err => {
        console.error("Error fetching available ETH lobbies:", err);
        bot.sendMessage(chatId, "An error occurred while fetching available ETH lobbies. Please try again later.");
    });
}

const awaitingLobbyJoin = {};

async function joinSelectedEthLobby(chatId, telegramUsername, lobbyId, emoji) {
    console.log("Inside joinSelectedEthLobby - Emoji:", emoji);

    console.log("Joining selected ETH lobby...");
    console.log("Emoji:", emoji);
    try {
        const lobby = await WageredLobby.findOne({ _id: lobbyId });
        if (!lobby) {
            bot.sendMessage(chatId, "The selected lobby does not exist or has been removed.");
            return;
        }

        if (lobby.players.includes(telegramUsername)) {
            bot.sendMessage(chatId, "You are already in this lobby.");
            return;
        }

        if (lobby.players.length >= lobby.maxPlayers) {
            bot.sendMessage(chatId, "This lobby is already full.");
            return;
        }

        // Fetch the user's Ethereum address
        const user = await User.findOne({ telegramUsername });
        if (!user || !user.ethereumAddress) {
            bot.sendMessage(chatId, 'Your Ethereum address is not registered. Please set it up first.');
            return;
        }

        const userAddress = user.ethereumAddress;
        
        // Check the ETH balance
        const userBalance = await contract.methods.ethBalances(userAddress).call();
        const userBalanceInEther = web3.utils.fromWei(userBalance, 'ether');
        
        if (parseFloat(userBalanceInEther) < lobby.wageredAmount) {
            bot.sendMessage(chatId, "You do not have enough balance to join this lobby.");
            return;
        }

        // Store the lobby details in the awaitingLobbyJoin object
        awaitingLobbyJoin[chatId] = {
            lobbyId: lobby._id,
            telegramUsername: telegramUsername,
            wageredAmount: lobby.wageredAmount
        };

        // Prompt the user to select an emoji for the lobby
        bot.sendMessage(chatId, "Please select an emoji for the lobby.");
    } catch (error) {
        console.error('Error joining the ETH lobby:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error joining the ETH lobby.');
    }
}

function joinRandomEthLobby(chatId, telegramUsername) {
    WageredLobby.find({ isFull: false, chosenBlockchain: 'ETH' })
    .then(lobbies => {
        if (!lobbies || lobbies.length === 0) {
            bot.sendMessage(chatId, "No available ETH lobbies to join at the moment.");
            return;
        }

        // Randomly select a lobby from the available lobbies
        const randomLobby = lobbies[Math.floor(Math.random() * lobbies.length)];
        
        joinSelectedEthLobby(chatId, telegramUsername, randomLobby._id);
    })
    .catch(err => {
        console.error("Error fetching available ETH lobbies:", err);
        bot.sendMessage(chatId, "An error occurred while fetching available ETH lobbies. Please try again later.");
    });
}

function isSingleEmoji(str) {
    const emojiRegex = /^[\p{Emoji}]{1}$/u;
    return emojiRegex.test(str);
}


bot.onText(/\/balances/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUsername = msg.from.username;

    if (msg.chat.type !== 'private') {
        bot.sendMessage(chatId, "Please use the /balances command in a direct message with the bot.");
        return;
    }

    try {
        // Fetch user's Ethereum address from the database
        const user = await User.findOne({ telegramUsername });
        if (!user || !user.ethereumAddress) {
            bot.sendMessage(chatId, 'Your Ethereum address is not registered. Please set it up first.');
            return;
        }

        const userAddress = user.ethereumAddress;

        // Get ETH balance
        const ethBalance = await contract.methods.ethBalances(userAddress).call();
        const ethBalanceInEther = web3.utils.fromWei(ethBalance, 'ether');
        
        // List of ERC20 token addresses you want to check
        const tokenAddresses = [
            "0x760b3adB45c7e927d32fB052c2977de4857563eD",  
            // ... Add more token addresses as needed
        ];

        let response = `Your contract balances are:\nETH: ${ethBalanceInEther}`;

        // Loop over each token address and fetch the balance
        for (let address of tokenAddresses) {
            const tokenBalance = await contract.methods.tokenBalances(userAddress, address).call();
            const tokenBalanceInEther = web3.utils.fromWei(tokenBalance, 'ether');
            response += `\nRalley: ${tokenBalanceInEther}`;
        }

        // Send balance information back to the user
        bot.sendMessage(chatId, response);
    } catch (error) {
        console.error('Error fetching balances:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error fetching your balances.');
    }
});

bot.onText(/\/setupWallet/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUsername = msg.from.username;

    if (msg.chat.type !== 'private') {
        bot.sendMessage(chatId, "Please use the /setupWallet command in a direct message with the bot.");
        return;
    }

    handleWalletSetup(chatId, telegramUsername, bot);
});

bot.onText(/\/startRace/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramUsername = msg.from.username;

    // Check if the command is sent in a private chat
    if (msg.chat.type === 'private') {
        bot.sendMessage(chatId, 'This command should only be used in chat to start a game with others.');
        return;
    }

    // Otherwise, show the welcome menu for group chats
    showWelcomeMenu(chatId, telegramUsername, bot);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    console.log("[bot.on('message')] Current awaitingEmoji object at start:", JSON.stringify(awaitingEmoji));

    // Check if we're awaiting an emoji in this chat
    if (awaitingEmoji[chatId]) {
        // Check if the message is from the user we're expecting
        if (awaitingEmoji[chatId].username === msg.from.username) {
            const emoji = msg.text;

            // Check if the message is a single emoji
            if (emoji && isSingleEmoji(emoji)) {

                if (emoji === '🌱' || emoji === '🏁') {
                    bot.sendMessage(chatId, "Sorry, you can't choose 🌱 or 🏁 as your emoji. Please pick a different emoji.");
                    return; // Exit the function early
                }

                if (awaitingEmoji[chatId].lobbyId) {
                    const lobbyId = awaitingEmoji[chatId].lobbyId;
                
                    // Retrieve the lobby from the database
                    const lobby = await Lobby.findById(lobbyId);
                
                    // Check if the chosen emoji is already in use
                    const emojiExists = lobby.players.some(player => player.emoji === emoji);
                
                    if (emojiExists) {
                        bot.sendMessage(chatId, "The chosen emoji is already in use in this lobby. Please pick a different emoji.");
                        return; // Exit the function early
                    }
                
                    // If the emoji is unique, add the user to the lobby
                    lobby.players.push({ username: msg.from.username, emoji: emoji });
                
                    // Notify the player they've successfully joined
                    bot.sendMessage(chatId, "You've successfully joined the lobby with your chosen emoji!")
                    .then(async () => {
                        // Check if the lobby is full
                        if (lobby.players.length === lobby.maxPlayers) {
                            lobby.isFull = true;
                
                            // Notify the creator that the lobby is full
                            const startGameOptions = {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: 'Start Game', callback_data: `start_free_game_${lobby._id}` }],
                                    ],
                                },
                                parse_mode: 'Markdown'
                            };
                            bot.sendMessage(lobby.chatId, `@${lobby.creator} The lobby is now full and you can start the game...`, startGameOptions);
                        } else {
                            // If the lobby isn't full, notify the player they've successfully joined and are waiting for others
                            bot.sendMessage(chatId, "You've successfully joined the lobby with your chosen emoji! Waiting on others to join...");
                        }
                        await lobby.save();
                    });

                } else if (awaitingEmoji[chatId].wageredAmount) {
                    // This means the user is trying to create a wagered lobby
                    
                    console.log("[bot.on('message')] Setting tempWageredLobbyDetails with numOfPlayers (maxPlayers for lobby):", awaitingEmoji[chatId].numOfPlayers);


                    const tempDetails = { ...awaitingEmoji[chatId] };
                    tempWageredLobbyDetails = {
                        wageredAmount: tempDetails.wageredAmount,
                        numOfPlayers: tempDetails.numOfPlayers,
                        emoji: emoji,
                        chatId: chatId,
                        username: msg.from.username
                    };
                
                    // Notify the user that the lobby is being created
                    bot.sendMessage(chatId, "Creating a wagered lobby with your chosen emoji, please wait...");
                
                    // Now, you can call your handleWageredLobbyChoiceEthEth function using the details from tempWageredLobbyDetails
                    await handleWageredLobbyChoiceEthEth(tempWageredLobbyDetails, bot);
                
                    // Remove the user from the awaitingEmoji list
                    delete awaitingEmoji[chatId];
                } else {
                    // This is for creating a free lobby

                    // Retrieve the number of players from the awaitingEmoji object
                    const numOfPlayers = awaitingEmoji[chatId].numOfPlayers;
                    console.log("[bot.on('message')] Retrieved numOfPlayers (maxPlayers for lobby) from awaitingEmoji:", numOfPlayers);

                    // Generate a unique gameId
                    const gameId = uuidv4();

                    // Save the emoji to the database
                    const newLobby = new Lobby({
                        gameId: gameId,
                        creator: msg.from.username,
                        maxPlayers: numOfPlayers,
                        players: [{ username: msg.from.username, emoji: emoji }],
                        chatId: chatId
                    });

                    try {
                        await newLobby.save();
                        bot.sendMessage(chatId, "Lobby created successfully with your chosen emoji! Waiting on others to join...");
                    } catch (error) {
                        console.error("Error saving lobby:", error);
                        bot.sendMessage(chatId, "Error creating lobby. Please try again.");
                    }
                }
            } else {
                bot.sendMessage(chatId, "Please send a valid single emoji.");
            }

            // Remove the user from the awaitingEmoji list
            delete awaitingEmoji[chatId];
        } else if (isSingleEmoji(msg.text)) {
            // If another user tries to send an emoji while the bot is waiting for a specific user
            bot.sendMessage(chatId, `I am waiting on @${awaitingEmoji[chatId].username} to send an emoji. Please wait.`);
        }
        // If the message is not an emoji, just let it pass without any bot response.
    }

    // Check if we're awaiting emoji for joining a wagered lobby
    if (awaitingLobbyJoin[chatId] && awaitingLobbyJoin[chatId].telegramUsername === msg.from.username) {
        const emoji = msg.text;

        // Check if the message is a single emoji
        if (emoji && isSingleEmoji(emoji)) {
            console.log("Emoji selected:", emoji);
            // Retrieve the lobby details from the awaitingLobbyJoin object
            const { lobbyId, telegramUsername, wageredAmount } = awaitingLobbyJoin[chatId];

            // Proceed with adding the user to the lobby and other logic
            joinSelectedEthLobby(chatId, telegramUsername, lobbyId, emoji); // Call the function here

            // Remove the user from the awaitingLobbyJoin object
            delete awaitingLobbyJoin[chatId];
        } else {
            bot.sendMessage(chatId, "Please send a valid single emoji.");
        }
    }

});



bot.on('message', (msg) => {
    // Check if the message is a command and it's a DM
    if (msg.text.startsWith('/') && msg.chat.type === 'private') {
        // Handle the /help command
        if (msg.text === '/help') {
            const helpMessage = `
Welcome to the Emoji Ralley Bot!

Here are the available commands:
- /balances: Check your ETH and ERC20 token balances.
- /setupWallet: Set up or update your Ethereum wallet address.

For more information or help, please contact the support team.
            `;

            bot.sendMessage(msg.chat.id, helpMessage);
        }
    }
});


bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    console.log("Callback data:", data);

    console.log("Received callback with data:", data);
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const telegramUsername = callbackQuery.from.username;

    if (data !== 'register') {
        const registered = await isUserRegistered(telegramUsername);
        if (!registered) {
            promptUserToRegister(chatId, bot);
            return; // exit the callback, don't execute further actions
        }
    }

    let result;

    if (data === 'register') {
        registerUser(callbackQuery, bot, showWelcomeMenu);
    } else if (data === 'start_race') {
        console.log('Start button pressed');
        const telegramUsername = callbackQuery.from.username; // Use username for querying
        
        const playModeText = `
    🎮 *Emoji Race* 🎮
    ========================
    Choose your preferred mode of play:
    `;
    
        // Base inline keyboard options
        const inlineKeyboardOptions = [
            [{ text: 'Free Play', callback_data: 'free_play' }],
            [{ text: 'Wager ETH', callback_data: 'chose_wager_eth_eth' }],
        ];
    
        // Check if player is in a wagered lobby
        const playerWageredLobby = await WageredLobby.findOne({ "players.username": telegramUsername });
    
        if (playerWageredLobby) {
            inlineKeyboardOptions.push([{ text: 'Leave Wager Lobby', callback_data: 'leave_wager_lobby' }]);
        }
    
        // Check if player is in a free lobby
        const playerFreeLobby = await Lobby.findOne({ "players.username": telegramUsername });
    
        if (playerFreeLobby) {
            inlineKeyboardOptions.push([{ text: 'Leave Free Lobby', callback_data: 'leave_free_lobby' }]);
        }
    
        const playModeOptions = {
            reply_markup: {
                inline_keyboard: inlineKeyboardOptions
            },
            parse_mode: 'Markdown'
        };
        
        bot.sendMessage(chatId, playModeText, playModeOptions);
    } else if (data === 'free_play') {
        const freePlayOptionsText = `
    🎮 *Free Play Mode* 🎮
    
    Select your lobby option:
        `;
        
        const freePlayOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🛠️ Create Free Lobby', callback_data: 'create_free_lobby' }],
                    [{ text: '🚪 Join Free Specific Lobby', callback_data: 'join_specific_free_lobby' }],
                    [{ text: '⬅️ Back', callback_data: 'start_race' }],
                ],
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(freePlayOptionsText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...freePlayOptions
        });
    } else if (data === 'wager_crypto') {
        console.log('Wager Crypto mode selected');
        
        const cryptoChoiceText = `
    Choose your preferred blockchain:
    `;
    
        const cryptoChoiceOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Ethereum (ETH)', callback_data: 'wager_eth' }],
                    [{ text: '⬅️ Back', callback_data: 'play_streetsOfMayhem' }],
                    // ... you can add more options here
                ],
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(cryptoChoiceText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...cryptoChoiceOptions
        });
    } else if (data === 'wager_eth') {
        console.log('Wagering on Ethereum Mainnet selected');
        const goerliChoiceText = `
    Choose your Ethereum Mainnet wager type:
    `;
    
        const goerliChoiceOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Wager ETH', callback_data: 'chose_wager_eth_eth' }],
                    [{ text: 'Wager ERC20', callback_data: 'chose_wager_eth_erc20' }],
                ],
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(goerliChoiceText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...goerliChoiceOptions
        });
    } else if (data === 'chose_wager_eth_eth') {
        const gethLobbyOptionsText = `
    Select your ETH lobby option:
    `;
    
        const gethLobbyOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🛠️ Create ETH Lobby', callback_data: 'wager_eth_eth' }],
                    [{ text: '🚪 Join ETH Lobby', callback_data: 'join_eth_lobby' }],
                    [{ text: '⬅️ Back', callback_data: 'start_race' }],
                ],
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(gethLobbyOptionsText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...gethLobbyOptions
        });
    }  else if (data === 'wager_eth_eth') {
        const mainMenuText = `
    Choose the range of ETH you want to wager:
    `;
    
        const mainMenuOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '0.005 ETH - 0.05 ETH', callback_data: 'eth_eth_range_0.005_0.05' }],
                    [{ text: '0.055 ETH - 0.1 ETH', callback_data: 'eth_eth_range_0.055_0.1' }],
                    [{ text: '0.15 ETH - 0.5 ETH', callback_data: 'eth_eth_range_0.15_0.5' }],
                    [{ text: '0.55 ETH - 1 ETH', callback_data: 'eth_eth_range_0.55_1' }],
                    [{ text: '⬅️ Back', callback_data: 'chose_wager_eth_eth' }],
                ]
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(mainMenuText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...mainMenuOptions
        });
    } else if (data.startsWith('eth_eth_range_')) {
        console.log("Inside the eth_eth_range_ case");

        

        const range = data.split('_')[3] + '_' + data.split('_')[4];
        let specificAmounts = [];
        let text = '';
        
        switch (range) {
            case '0.005_0.05':
                text = 'Choose a specific ETH amount:';
                specificAmounts = ['0.005', '0.01', '0.015', '0.02', '0.025', '0.03', '0.035', '0.04', '0.045', '0.05'];
                break;
            case '0.055_0.1':
                text = 'Choose a specific ETH amount:';
                specificAmounts = ['0.055', '0.06', '0.065', '0.07', '0.075', '0.08', '0.085', '0.09', '0.095', '0.1'];
                break;
            case '0.15_0.5':
                text = 'Choose a specific ETH amount:';
                specificAmounts = ['0.15', '0.2', '0.25', '0.3', '0.35', '0.45', '0.5'];
                break;
            case '0.55_1':
                text = 'Choose a specific ETH amount:';
                specificAmounts = ['0.55', '0.6', '0.65', '0.7', '0.75', '0.8', '0.85', '0.9', '0.95', '1'];
                break;
        }
    
        const specificMenuOptions = {
            reply_markup: {
                inline_keyboard: specificAmounts.map(amount => [{ text: `${amount} ETH`, callback_data: `eth_eth_amount_${amount}` }]).concat([[{ text: '⬅️ Back', callback_data: 'wager_eth_eth' }]])
            },
            parse_mode: 'Markdown'
        };
        
        bot.editMessageText(text, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...specificMenuOptions
        });
    
    }  else if (data.startsWith('eth_eth_amount_')) {
        const chosenAmount = data.split('_')[3];
        const wagerText = `You are choosing to wager ${chosenAmount} ETH on Mainnet`;
        console.log("This is the chosen amount: " + chosenAmount);
    
        const wagerOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '2 Players', callback_data: `wager_lobby_eth_eth_2_${chosenAmount}` }],
                    [{ text: '3 Players', callback_data: `wager_lobby_eth_eth_3_${chosenAmount}` }],
                    [{ text: '4 Players', callback_data: `wager_lobby_eth_eth_4_${chosenAmount}` }],
                    [{ text: '5 Players', callback_data: `wager_lobby_eth_eth_5_${chosenAmount}` }],
                    [{ text: '6 Players', callback_data: `wager_lobby_eth_eth_6_${chosenAmount}` }],
                    [{ text: '7 Players', callback_data: `wager_lobby_eth_eth_7_${chosenAmount}` }],
                    [{ text: '8 Players', callback_data: `wager_lobby_eth_eth_8_${chosenAmount}` }],
                    [{ text: '⬅️ Back', callback_data: 'wager_eth_eth' }],
                ]
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(wagerText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...wagerOptions
        });
    } else if (data.startsWith('wager_lobby_eth_eth_')) {
        const numOfPlayers = data.split('_')[4];
        const chosenAmount = parseFloat(data.split('_')[5]);
        await checkBalanceAndWagerEthEth(chatId, chosenAmount, telegramUsername, bot, callbackQuery, numOfPlayers);

        // Set the awaitingEmoji flag for this user
        awaitingEmoji[chatId] = {
            username: telegramUsername,
            numOfPlayers: numOfPlayers,
            wageredAmount: chosenAmount
        };

        // Prompt the user to select an emoji
        bot.sendMessage(chatId, "Please select an emoji for the wagered lobby.");
    } else if (data === 'chose_wager_eth_erc20') {
        bot.sendMessage(chatId, "This option will be available soon...");
    } else if (data.startsWith('join_eth_lobby')) {
        fetchAvailableEthLobbies(chatId);
    } else if (data.startsWith('select_eth_lobby_')) {
        const lobbyId = data.split('_')[3];  // Extract the _id from the callback data
        const emoji = data.split('_')[4];     // Extract the emoji from the callback data
        console.log("Lobby ID:", lobbyId);
        console.log("Emoji from callback:", emoji);
    
        if (emoji) {
            joinSelectedEthLobby(chatId, telegramUsername, lobbyId, emoji);
        } else {
            bot.sendMessage(chatId, "Emoji value is missing.");
        }
    } else if (data.startsWith('join_eth_random')) {
        joinRandomEthLobby(chatId, telegramUsername);
    } else if (data.startsWith('start_wagered_game_')) {
        console.log("Start wagered game callback triggered");
        startWageredGame(callbackQuery, bot);
    } else if (data === 'create_lobby') {
        streetsOfMayhem.createLobbyStreetsOfMayhem(callbackQuery, bot);
    } else if (data.startsWith('lobby_')) {
        streetsOfMayhem.handleLobbyChoice(callbackQuery, bot);
    } else if (data === 'join_random') {
        streetsOfMayhem.joinRandom(callbackQuery, bot);
    } else if (data.startsWith('join_lobby_')) {
        const lobbyId = data.split('_')[2];
    
        // Prompt the user for their emoji choice
        const emojiPromptText = `@${callbackQuery.from.username}, please send the emoji you'd like to use for the game.`;
    
        bot.sendMessage(chatId, emojiPromptText);
    
        // Store the chatId, username, and lobbyId in the awaitingEmoji object
        awaitingEmoji[chatId] = { username: callbackQuery.from.username, lobbyId: lobbyId };
    } else if (data === 'leave_free_lobby') {
        console.log('Attempting to leave free lobby...');
    
        // Find the lobby that the player is currently in
        const existingLobby = await Lobby.findOne({ "players.username": callbackQuery.from.username });
    
        if (!existingLobby) {
            bot.sendMessage(chatId, "You are not currently in any lobby.");
            return;
        }
    
        // Remove the player from the lobby's players array
        existingLobby.players = existingLobby.players.filter(player => player.username !== callbackQuery.from.username);
    
        // If the player is the creator of the lobby
        if (existingLobby.creator === callbackQuery.from.username) {
            if (existingLobby.players.length > 0) {
                // Assign the next player as the new creator
                existingLobby.creator = existingLobby.players[0].username;
            } else {
                // If the player is the only one in the lobby, delete the lobby
                await Lobby.deleteOne({ _id: existingLobby._id });
                bot.sendMessage(chatId, "You have left the lobby and the lobby has been deleted since there are no more players.");
                return;
            }
        }
    
        // Save the updated lobby
        await existingLobby.save();
    
        bot.sendMessage(chatId, "You have successfully left the lobby.");
    } else if (data === 'leave_wager_lobby') {
        streetsOfMayhem.handleLeaveWageredLobby(callbackQuery, bot);
    } else if (data.startsWith('start_free_game')) {
        // Assuming you have the lobbyId stored in the data callback
        const lobbyId = data.split('_')[3];
        console.log('Start free game has been clicked for lobby:', lobbyId);
        const lobby = await Lobby.findById(lobbyId);
    
        // Notify users that the game is starting
        await bot.sendMessage(chatId, "Please wait, starting free game...");
    
        // Create a new FreeGame instance
        const newGame = new FreeGame({
            chatId: lobby.chatId,
            players: lobby.players,
            state: 'waiting',
            currentPlayerIndex: 0, // if needed
            isFinished: false,
        });

        const savedGame = await newGame.save();
        const gameId = savedGame._id;
    
        try {
    
            // Delete the lobby
            await Lobby.findByIdAndDelete(lobbyId);
    
            console.log('Game started and lobby deleted successfully.');
    
            // Get the players and their emojis
            const players = newGame.players;
    
            // Initialize the race track
            const trackLength = 10;
            let raceTracks = players.map(player => {
                return {
                    username: player.username,
                    emoji: player.emoji,
                    position: 0
                };
            });
    
            const renderRace = () => {
                let raceMessage = '🏁 Start 🏁\n\n';
                raceTracks.forEach(track => {
                    raceMessage += `${'🌱'.repeat(track.position)}${track.emoji}${'🌱'.repeat(trackLength - track.position - 1)} 🏁\n`;
                });
                return raceMessage;
            };
    
            const sentMessage = await bot.sendMessage(chatId, renderRace());
    
            // Simulate the race
            let raceInterval = setInterval(() => {
                raceTracks.forEach(track => {
                    let moveSteps = Math.floor(Math.random() * 3); // Move 0, 1, or 2 steps
                    track.position += moveSteps;
                    if (track.position >= trackLength) track.position = trackLength - 1;
                });
    
                bot.editMessageText(renderRace(), {
                    chat_id: chatId,
                    message_id: sentMessage.message_id
                });
            }, 1000);
    
            // End the race after 10 seconds
            setTimeout(async () => {
                clearInterval(raceInterval);
    
                // Determine the winner
                let maxPosition = -1;
                let winner = null;
                raceTracks.forEach(track => {
                    if (track.position > maxPosition) {
                        maxPosition = track.position;
                        winner = track;
                    }
                });

                // Update the game state to 'completed' in the database
                await FreeGame.findByIdAndUpdate(gameId, { state: 'completed' });
                await FreeGame.findByIdAndUpdate(gameId, { isFinished: 'true' });
    
                let raceMessage = renderRace();
                raceMessage += `\n\nAnd the winner is ${winner.username} with the emoji ${winner.emoji}!`;
    
                bot.editMessageText(raceMessage, {
                    chat_id: chatId,
                    message_id: sentMessage.message_id
                });
            }, 10000);
            
        } catch (error) {
            console.error('Error starting the game:', error);
            bot.sendMessage(chatId, 'Error starting the game. Please try again.');
        }
    } else if (data === 'create_free_lobby') {
        console.log('Creating a free play lobby...');

        // Check if the player is already in a lobby
        const existingLobby = await Lobby.findOne({ "players.username": callbackQuery.from.username });
        
        if (existingLobby) {
            // If the player is already in a lobby, send a message and exit
            bot.sendMessage(chatId, "You are already in a lobby, either leave or start the game.");
            return;
        }
    
        const numOfPlayersText = `
    🎮 *Emoji Race - Free Play* 🎮
    ========================
    Choose the number of players for your lobby:
    `;
    
        const numOfPlayersOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '2 Players', callback_data: 'free_lobby_2' }],
                    [{ text: '3 Players', callback_data: 'free_lobby_3' }],
                    [{ text: '4 Players', callback_data: 'free_lobby_4' }],
                    [{ text: '5 Players', callback_data: 'free_lobby_5' }],
                    [{ text: '6 Players', callback_data: 'free_lobby_6' }],
                    [{ text: '7 Players', callback_data: 'free_lobby_7' }],
                    [{ text: '8 Players', callback_data: 'free_lobby_8' }],
                    [{ text: '⬅️ Back', callback_data: 'free_play' }],
                ],
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText(numOfPlayersText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...numOfPlayersOptions
        });
    } else if (data.startsWith('free_lobby_')) {
        const numOfPlayers = parseInt(data.split('_')[2], 10); 
    
        // Prompt the creator for their emoji choice
        const emojiPromptText = `@${callbackQuery.from.username}, please send the emoji you'd like to use for the game.`;

    
        bot.sendMessage(chatId, emojiPromptText);
    
        // Store the chatId, username, and numOfPlayers in the awaitingEmoji object
        awaitingEmoji[chatId] = { username: callbackQuery.from.username, numOfPlayers: numOfPlayers };
    } else if (data === 'join_specific_free_lobby') {
        console.log('Joining a specific free play lobby...');
    
        // 1. Fetch the list of available lobbies
        const availableLobbies = await Lobby.find({ isFull: false });
    
        // 2. Display the list of lobbies to the user
        const lobbyButtons = availableLobbies.map(lobby => {
            return [{ text: lobby.creator, callback_data: `join_lobby_${lobby._id}` }];
        });
    
        const lobbyOptions = {
            reply_markup: {
                inline_keyboard: lobbyButtons.concat([[{ text: '⬅️ Back', callback_data: 'free_play' }]])
            },
            parse_mode: 'Markdown'
        };
    
        bot.editMessageText("Choose a lobby to join:", {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...lobbyOptions
        });
    }
    else if (data === 'join_random_free_lobby') {
        console.log('Joining a random free play lobby...');
        // Logic for joining a random free play lobby goes here
    }
    else if (data === 'main_menu') {
        console.log('Returning to the main menu...');
        // Logic for displaying the main menu goes here
    } else if (data === 'setup_wallet') {
        console.log('Please DM the bot to set up your wallet');
        bot.sendMessage(chatId, 'Please DM the bot to set up your wallet');
    } 
     else if (data === 'games_menu') {
        const gameMenuButtons = [
            [{ text: 'Streets of Mayhem 🌆', callback_data: 'play_streetsOfMayhem' }],
            // Add other games here...
        ];
        const gameMenuText = `
    🎮 *Gaming Arena* 🎮
    ===================
    Welcome, adventurer! Dive into one of our thrilling games and experience the excitement.
    
    🔽 *Select a game to play:* 🔽
    `;
    
        const gameMenuOptions = {
            reply_markup: {
                inline_keyboard: gameMenuButtons
            },
            parse_mode: 'Markdown'
        };
    
        bot.sendMessage(chatId, gameMenuText, gameMenuOptions);
    }
    
    // Process the result using the helper function
    processBotResult(result, bot);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

module.exports.distributeWinnings = distributeWinnings;
     
    
      
    
