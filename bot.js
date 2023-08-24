require('dotenv').config();
const contractAddress = '0xfD9166E92B788dD6Ff9C7DA2CB0396d0fb746BcB';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NFTDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NFTSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"}],"name":"TokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WinnerPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[{"internalType":"address","name":"erc721Address","type":"address"}],"name":"addAllowedERC721Address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"}],"name":"addAllowedNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"addAllowedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedERC721Addresses","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedNFTAddresses","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"}],"name":"deductPlayerWagers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"erc721Address","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"depositRewardERC721","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"depositRewardNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ethBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getNFTQuantity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"winningsAmount","type":"uint256"},{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"},{"internalType":"address","name":"nftRecipient","type":"address"},{"internalType":"uint256","name":"nftTokenId","type":"uint256"},{"internalType":"uint256","name":"nftQuantity","type":"uint256"}],"name":"handleGameResults","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"winningsAmount","type":"uint256"},{"internalType":"address[]","name":"players","type":"address[]"},{"internalType":"uint256[]","name":"wagers","type":"uint256[]"},{"internalType":"address","name":"nftRecipient","type":"address"},{"internalType":"uint256","name":"nftTokenId","type":"uint256"},{"internalType":"uint256","name":"nftQuantity","type":"uint256"}],"name":"handleGameResultsERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftQuantities","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"erc721Address","type":"address"}],"name":"removeAllowedERC721Address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"}],"name":"removeAllowedNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardNFTAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"erc721Address","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"sendRewardERC721","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"sendRewardNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"nftAddress","type":"address"}],"name":"setNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"tokenBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const HOUSE_ADDRESS = '0x0FE31BC3cED8a31332d6087408381a1221147a2B';
const TelegramBot = require('node-telegram-bot-api');
const Database = require('./src/db');
const Resources = require('./games/streetsOfMayhem/schemas/resources');
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const ethers = require('ethers'); // You might not need ethers if you're only using web3
const Web3 = require('web3');
const mongoose = require('mongoose');

const SENDER_ADDRESS = process.env.SENDER_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const web3 = new Web3.Web3(process.env.MAINNET_INFURA_URL);

const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_INFURA_URL);
const ethersWallet = new ethers.Wallet('0x' + PRIVATE_KEY).connect(provider);
const ethersContract = new ethers.Contract(contractAddress, contractABI, ethersWallet);
console.log(ethersWallet.address);

const contract = new web3.eth.Contract(contractABI, contractAddress);

const registerUser = require('./src/register');
const User = require('./src/user');

// Schemas
const Game = require('./emojiRace/schemas/games');
const Lobby = require('./emojiRace/schemas/lobbies');
const WageredLobby = require('./emojiRace/schemas/wageredLobbies');

// Controllers


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
🌆 *Welcome Player!* 🌆

Dive into a world where crypto, community, and competition converge. Crafted to kindle community building in the crypto realm through immersive gameplay, our bot hosts multiple games for you to indulge in.

💎 *Featured Game:* Streets of Mayhem! 
A journey through power corridors, where every decision you make can shape the landscape of an ERC20 city.

🔗 Explore [Project Mayhem](https://t.me/mayhemportal) and be a part of the revolution.

🎮 Ready to embark on a gaming adventure? Choose from the options below:
`;

    let mainMenuButtons = [];

    if (isRegistered) {
        mainMenuButtons.push([{ text: '🎮 Games', callback_data: 'games_menu' }]);
        
        // Check if the user has set up an Ethereum address
        if (!isRegistered.ethereumAddress) {
            mainMenuButtons.push([{ text: '🔗 Setup Wallet', callback_data: 'setup_wallet' }]);
        }
        
        mainMenuButtons.push([{ text: '📩 Contact', callback_data: 'view_thebiggiver' }]);
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
        const user = await User.findOne({ telegramUsername });
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
        } else {
            // If the user has enough balance, allow them to create a wagered lobby
            await handleWageredLobbyChoiceEthEth(callbackQuery, bot);
        }
    } catch (error) {
        console.error('Error checking wager against balance:', error);
        bot.sendMessage(chatId, 'Sorry, there was an error checking your wager against your balance.');
    }
}

async function handleWageredLobbyChoiceEthEth(callbackQuery, bot) {
    const { message, from } = callbackQuery;
    const chatId = message.chat.id;
    const telegramUsername = from.username;

    const canJoin = await canJoinLobby(telegramUsername);
    if (!canJoin) {
        bot.sendMessage(chatId, "You are already in an ongoing game. Finish it before joining or creating a new wagered lobby!");
        return;
    }

    const existingLobby = await WageredLobby.findOne({ players: telegramUsername, isFull: false });
    if (existingLobby) {
        bot.sendMessage(chatId, "You are already in a wagered lobby. Please leave your current lobby before creating a new one.");
        return;
    }

    const splitData = callbackQuery.data.split('_');
    const numOfPlayers = parseInt(splitData[4], 10);
    const wageredAmount = parseFloat(splitData[5]);


    const user = await User.findOne({ telegramUsername: telegramUsername });
    if (!user) {
        bot.sendMessage(chatId, `Unable to locate user in database. Please ensure you're registered.`);
        return;
    }

    bot.sendMessage(chatId, "Creating a wagered lobby, please wait...");

    // Check the contract for all of the available NFTs
    let availableNFTs = [];
    for (let i = 1; i <= 28; i++) {
        const quantity = await ethersContract.getNFTQuantity(i);
        console.log(`NFT ID: ${i}, Quantity: ${quantity}`);
        if (quantity > 1) {
            availableNFTs.push(i);
        }
    }

    // Remove NFTs that are already in ongoing games
    const ongoingGames = await Game.find({ isFinished: false });
    availableNFTs = availableNFTs.filter(nftId => {
        for (let game of ongoingGames) {
            if (game.wageredLobby.nftReward === nftId) {
                return false; // NFT is already in an ongoing game
            }
        }
        return true; // NFT is not in any ongoing game
    });

    

    const newWageredLobby = new WageredLobby({
        players: [telegramUsername],
        maxPlayers: numOfPlayers,
        creator: telegramUsername,
        chatId: chatId,
        gameId: new mongoose.Types.ObjectId().toString(),  // This will automatically generate a unique string ID
        chosenBlockchain: 'ETH',
        currencyType: 'ETH',
        chosenCurrency: 'ETH',
        wageredAmount: wageredAmount,
        ethereumAddress: user.ethereumAddress
    });

    // 25% chance to pick an NFT as a reward
    if (Math.random() <= 1 && availableNFTs.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableNFTs.length);
        newWageredLobby.nftReward = availableNFTs[randomIndex];
    }

    try {
        await newWageredLobby.save();
        // Create an inline keyboard button to join the wagered lobby
        const joinButton = {
            text: `Join ${wageredAmount.toFixed(4)} lobby`,
            callback_data: `select_eth_lobby_${newWageredLobby._id}`  // Using the structure you've provided
        };
        const opts = {
            reply_markup: {
                inline_keyboard: [[joinButton]]
            }
        };

        bot.sendMessage(chatId, `Wagered lobby for ${numOfPlayers} players created! \nWaiting for others to join...`, opts);
        // Reset the message back to the main menu
        //displayStreetsOfMayhemMenu(chatId, telegramUsername, bot, message.message_id);
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

async function joinSelectedEthLobby(chatId, telegramUsername, lobbyId) {
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

        lobby.players.push(telegramUsername);
        if (lobby.players.length === lobby.maxPlayers) {
            lobby.isFull = true;
        }

        await lobby.save();
        bot.sendMessage(chatId, `You've successfully joined ${lobby.creator}'s ETH lobby!`);

        if (lobby.isFull) {
            const startGameOptions = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Start Game', callback_data: `start_wagered_game_${lobby._id}` }],
                    ],
                },
                parse_mode: 'Markdown'
            };
            bot.sendMessage(lobby.chatId, `@${lobby.creator}, your ETH lobby is now full! You can start the game.`, startGameOptions);
        }
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

bot.onText(/^\/start$/, (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;

    // Check if the message is a Direct Message
    if (chatType === 'private') {
        const message = `
Welcome to the Mayhem Games Bot!

Here are the available commands:
- /balances: Check your ETH and ERC20 token balances.
- /setupWallet: Set up or update your Ethereum wallet address.
- /startMayhem: Start the Mayhem game (use this in a group chat).

For more information or help, please contact the support team.
        `;

        bot.sendMessage(chatId, message);
    } else {
        bot.sendMessage(chatId, "The /start command is intended for Direct Messages. Please DM the bot directly.");
    }
});

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

        let response = `Your balances are:\nETH: ${ethBalanceInEther}`;

        // Loop over each token address and fetch the balance
        for (let address of tokenAddresses) {
            const tokenBalance = await contract.methods.tokenBalances(userAddress, address).call();
            const tokenBalanceInEther = web3.utils.fromWei(tokenBalance, 'ether');
            response += `\nMayhem: ${tokenBalanceInEther}`;
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
    } else if (data === 'play_streetsOfMayhem') {
        console.log('Button pressed for Streets of Mayhem');
        const telegramUsername = callbackQuery.from.username; // Use username for querying
        
        const playModeText = `
    🎮 *Streets of Mayhem* 🎮
    ========================
    Choose your preferred mode of play:
    `;
    
        // Base inline keyboard options
        const inlineKeyboardOptions = [
            [{ text: 'Free Play', callback_data: 'free_play' }],
            [{ text: 'Wager Crypto', callback_data: 'wager_crypto' }],
        ];
    
        // Check if player is in a wagered lobby
        const playerLobby = await WageredLobby.findOne({ players: telegramUsername });
        if (playerLobby) {
            inlineKeyboardOptions.push([{ text: 'Leave Wager Lobby', callback_data: 'leave_wager_lobby' }]);
        }
    
        const playModeOptions = {
            reply_markup: {
                inline_keyboard: inlineKeyboardOptions
            },
            parse_mode: 'Markdown'
        };
        
        bot.sendMessage(chatId, playModeText, playModeOptions);
    } else if (data === 'free_play') {
        console.log('Free Play mode selected for Streets of Mayhem');
        streetsOfMayhem.startStreetsOfMayhem(callbackQuery, bot);
    } else if (data === 'wager_crypto') {
        console.log('Wager Crypto mode selected for Streets of Mayhem');
        
        const cryptoChoiceText = `
    Choose your preferred blockchain:
    `;
    
        const cryptoChoiceOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Ethereum (ETH)', callback_data: 'wager_eth' }],
                    [{ text: 'Base', callback_data: 'wager_base' }],
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
                    [{ text: '🎲 Join ETH Random', callback_data: 'join_eth_random' }],
                    [{ text: '⬅️ Back', callback_data: 'wager_crypto' }],
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
        const numOfPlayers = data.split('_')[3];
        const chosenAmount = parseFloat(data.split('_')[5]);
        await checkBalanceAndWagerEthEth(chatId, chosenAmount, telegramUsername, bot, callbackQuery, numOfPlayers);

        // Edit the message to show the "main menu"
    const playModeText = `
    🎮 *Streets of Mayhem* 🎮
    ========================
    Choose your preferred mode of play:
    `;
        const playModeOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Free Play', callback_data: 'free_play' }],
                    [{ text: 'Wager Crypto', callback_data: 'wager_crypto' }],
                ],
            },
            parse_mode: 'Markdown'
        };
        bot.editMessageText(playModeText, {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            ...playModeOptions
        });
    } else if (data === 'chose_wager_eth_erc20') {
        bot.sendMessage(chatId, "This option will be available soon...");
    } else if (data.startsWith('join_eth_lobby')) {
        fetchAvailableEthLobbies(chatId);
    } else if (data.startsWith('select_eth_lobby_')) {
        const lobbyId = data.split('_')[3];  // Extract the _id from the callback data
        joinSelectedEthLobby(chatId, telegramUsername, lobbyId);
    } else if (data.startsWith('join_eth_random')) {
        joinRandomEthLobby(chatId, telegramUsername);
    } else if (data.startsWith('start_wagered_game_')) {
        console.log("Start wagered game callback triggered");
        startWageredGame(callbackQuery, bot);
    } else if (data === 'wager_base') {
        bot.sendMessage(chatId,"This option will be set up soon...");
        console.log("This option will be set up soon...");
    } else if (data === 'create_lobby') {
        streetsOfMayhem.createLobbyStreetsOfMayhem(callbackQuery, bot);
    } else if (data.startsWith('lobby_')) {
        streetsOfMayhem.handleLobbyChoice(callbackQuery, bot);
    } else if (data === 'join_random') {
        streetsOfMayhem.joinRandom(callbackQuery, bot);
    } else if (data.startsWith('join_lobby')) {
        streetsOfMayhem.joinLobby(callbackQuery, bot);
    } else if (data === 'leave_lobby') {
        streetsOfMayhem.handleLeaveLobby(callbackQuery, bot);
    } else if (data === 'leave_wager_lobby') {
        streetsOfMayhem.handleLeaveWageredLobby(callbackQuery, bot);
    } else if (data.startsWith('start_game_')) {
        streetsOfMayhem.startGameStreetsOfMayhem(callbackQuery, bot);
    } else if (data.startsWith('game_menu')) {
        result = await streetsOfMayhem.handleGameMenu(callbackQuery, bot);
    } else if (data === 'setup_wallet') {
        // Send a DM to the user prompting them to set up their wallet
        bot.sendMessage(chatId, "Please DM the bot with the start command to set up your address.");
        handleWalletSetup(userId, callbackQuery.from.username, bot);
    } else if (data === 'main_menu') {
        const messageId = callbackQuery.message.message_id;
        streetsOfMayhem.displayStreetsOfMayhemMenu(chatId, telegramUsername, bot, messageId);
    } else if (data === 'games_menu') {
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
