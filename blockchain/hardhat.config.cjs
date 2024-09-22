require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const { SEPOLIA_API_URL, POLYGON_AMOY_API_URL, ADMIN_WALLET_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      // chainId: 11155111,
      url: SEPOLIA_API_URL,
      accounts: [`${ADMIN_WALLET_PRIVATE_KEY}`],
    },
    polygonAmoy: {
      url: POLYGON_AMOY_API_URL,
      accounts: [`${ADMIN_WALLET_PRIVATE_KEY}`],
    },
  }
};
