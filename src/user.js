const mongoose = require('mongoose');
const ethers = require('ethers'); // Include the ethers library for Ethereum address validation

const userSchema = new mongoose.Schema({
    telegramUsername: {
        type: String,
        required: true,
        unique: true,
    },
    ethereumAddress: {
        type: String,
        validate: {
            validator: function(address) {
                const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
                return ethereumAddressRegex.test(address);
            },
            message: props => `${props.value} is not a valid Ethereum address!`
        },
        required: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
