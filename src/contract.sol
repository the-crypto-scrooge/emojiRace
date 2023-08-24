// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MayhemGames is Ownable, ReentrancyGuard, ERC1155Receiver, IERC721Receiver {
    using SafeMath for uint256;

    // State variables
    mapping(address => uint256) public ethBalances;
    mapping(address => mapping(address => uint256)) public tokenBalances;
    mapping(address => bool) public allowedTokens;
    address public rewardNFTAddress;
    mapping(uint256 => uint256) public nftQuantities;
    mapping(address => bool) public allowedNFTAddresses;
    mapping(address => bool) public allowedERC721Addresses;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event TokenDeposited(address indexed user, address token, uint256 amount);
    event NFTDeposited(address indexed user, uint256 tokenId);
    event NFTSent(address indexed to, uint256 tokenId);
    event Withdrawn(address indexed user, uint256 amount);
    event TokenWithdrawn(address indexed user, address token, uint256 amount);
    event TokenAdded(address token);
    event WinnerPaid(address indexed winner, uint256 amount);

    constructor() {}

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    )
        external pure override returns (bytes4)
    {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    )
        external pure override returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
    external view override returns (bytes4) {
    require(allowedERC721Addresses[msg.sender], "ERC721 address not allowed");
    return this.onERC721Received.selector;
    }

    function deposit() external payable {
        ethBalances[msg.sender] = ethBalances[msg.sender].add(msg.value);
        emit Deposited(msg.sender, msg.value);
    }

    function depositToken(address token, uint256 amount) external {
        require(allowedTokens[token], "Token not allowed");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokenBalances[msg.sender][token] = tokenBalances[msg.sender][token].add(amount);
        emit TokenDeposited(msg.sender, token, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(ethBalances[msg.sender] >= amount, "Insufficient balance");
        ethBalances[msg.sender] = ethBalances[msg.sender].sub(amount);
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function withdrawToken(address token, uint256 amount) external nonReentrant {
        require(tokenBalances[msg.sender][token] >= amount, "Insufficient balance");
        tokenBalances[msg.sender][token] = tokenBalances[msg.sender][token].sub(amount);
        IERC20(token).transfer(msg.sender, amount);
        emit TokenWithdrawn(msg.sender, token, amount);
    }

    function getNFTQuantity(uint256 tokenId) external view returns (uint256) {
        return nftQuantities[tokenId];
    }

    function addAllowedToken(address token) external onlyOwner {
        allowedTokens[token] = true;
        emit TokenAdded(token);
    }

    function setNFTAddress(address nftAddress) external onlyOwner {
        rewardNFTAddress = nftAddress;
    }

    function addAllowedNFTAddress(address nftAddress) external onlyOwner {
        allowedNFTAddresses[nftAddress] = true;
    }

    function removeAllowedNFTAddress(address nftAddress) external onlyOwner {
        allowedNFTAddresses[nftAddress] = false;
    }

    function depositRewardNFT(address nftAddress, uint256 tokenId, uint256 quantity) external onlyOwner {
        require(allowedNFTAddresses[nftAddress], "NFT address not allowed");
        IERC1155(nftAddress).safeTransferFrom(msg.sender, address(this), tokenId, quantity, "");
        nftQuantities[tokenId] = nftQuantities[tokenId].add(quantity);
        emit NFTDeposited(msg.sender, tokenId);
    }

    function sendRewardNFT(address nftAddress, address to, uint256 tokenId, uint256 quantity) external onlyOwner {
        require(allowedNFTAddresses[nftAddress], "NFT address not allowed");
        require(nftQuantities[tokenId] >= quantity, "Insufficient NFTs");
        nftQuantities[tokenId] = nftQuantities[tokenId].sub(quantity);
        IERC1155(nftAddress).safeTransferFrom(address(this), to, tokenId, quantity, "");
        emit NFTSent(to, tokenId);
    }

    function addAllowedERC721Address(address erc721Address) external onlyOwner {
        allowedERC721Addresses[erc721Address] = true;
    }

    function removeAllowedERC721Address(address erc721Address) external onlyOwner {
        allowedERC721Addresses[erc721Address] = false;
    }

    function depositRewardERC721(address erc721Address, uint256 tokenId) external onlyOwner {
        require(allowedERC721Addresses[erc721Address], "ERC721 address not allowed");
        IERC721(erc721Address).safeTransferFrom(msg.sender, address(this), tokenId);
        // No need to update nftQuantities because each ERC721 token is unique
        emit NFTDeposited(msg.sender, tokenId); // Reusing the same event; you may want to create a separate event for clarity
    }

    function sendRewardERC721(address erc721Address, address to, uint256 tokenId) external onlyOwner {
        require(allowedERC721Addresses[erc721Address], "ERC721 address not allowed");
        IERC721(erc721Address).safeTransferFrom(address(this), to, tokenId);
        emit NFTSent(to, tokenId); // Reusing the same event; again, you might want a different event for clarity
    }

    function deductPlayerWagers(address[] memory players, uint256[] memory wagers) external onlyOwner {
    require(players.length == wagers.length, "Players and wagers length mismatch");

        for (uint256 i = 0; i < players.length; i++) {
            require(ethBalances[players[i]] >= wagers[i], "Insufficient balance for wager");
            ethBalances[players[i]] = ethBalances[players[i]].sub(wagers[i]);
        }
    }

    function handleGameResults(
        address winner,
        uint256 winningsAmount,
        address[] memory players,
        uint256[] memory wagers,
        address nftRecipient,
        uint256 nftTokenId,
        uint256 nftQuantity
    ) external onlyOwner {
        require(players.length == wagers.length, "Players and wagers length mismatch");
        
        // Send ETH winnings directly to the winner
        payable(winner).transfer(winningsAmount);
        
        // Send out the NFT reward
        if (nftRecipient != address(0) && nftQuantity > 0) {
            require(nftQuantities[nftTokenId] >= nftQuantity, "Insufficient NFTs for reward");
            nftQuantities[nftTokenId] = nftQuantities[nftTokenId].sub(nftQuantity);
            IERC1155(rewardNFTAddress).safeTransferFrom(address(this), nftRecipient, nftTokenId, nftQuantity, "");
            emit NFTSent(nftRecipient, nftTokenId);
        }

        emit WinnerPaid(winner, winningsAmount);
    }

    function handleGameResultsERC20(
        address token,
        address winner,
        uint256 winningsAmount,
        address[] memory players,
        uint256[] memory wagers,
        address nftRecipient,
        uint256 nftTokenId,
        uint256 nftQuantity
    ) external onlyOwner {
        require(allowedTokens[token], "Token not allowed");
        require(players.length == wagers.length, "Players and wagers length mismatch");

        // Send ERC20 winnings directly to the winner
        IERC20(token).transfer(winner, winningsAmount);


        // Send out the NFT reward
        if (nftRecipient != address(0) && nftQuantity > 0) {
            require(nftQuantities[nftTokenId] >= nftQuantity, "Insufficient NFTs for reward");
            nftQuantities[nftTokenId] = nftQuantities[nftTokenId].sub(nftQuantity);
            IERC1155(rewardNFTAddress).safeTransferFrom(address(this), nftRecipient, nftTokenId, nftQuantity, "");
            emit NFTSent(nftRecipient, nftTokenId);
        }

        emit WinnerPaid(winner, winningsAmount);
    }
}
