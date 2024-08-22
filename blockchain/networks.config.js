require('dotenv').config()

const { LOCALHOST_DEPLOYMENT_ADDRESS, POLYGON_AMOY_DEPLOYMENT_ADDRESS, SEPOLIA_DEPLOYMENT_ADDRESS } = process.env;


export const networkConfig = {
    "31337": {
        "medSafe": {
            "address": LOCALHOST_DEPLOYMENT_ADDRESS
        },
        "explorerURL": "#"
    },
    "80002": {
        "medSafe": {
            "address": POLYGON_AMOY_DEPLOYMENT_ADDRESS
        },
        "explorerURL": "https://www.oklink.com/amoy/"
    },
    "11155111": {
        "medSafe": {
            "address": SEPOLIA_DEPLOYMENT_ADDRESS
        },
        "explorerURL": "https://sepolia.etherscan.io/"
    }
}
