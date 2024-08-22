

export const networkConfig = {
    "31337": {
        "medSafe": {
            "address": process.env.localhostDeploymentAddress
        },
        "explorerURL": "#"
    },
    "80002": {
        "medSafe": {
            "address": process.env.polygonAmoyDeploymentAddress
        },
        "explorerURL": "https://www.oklink.com/amoy/"
    },
    "11155111": {
        "medSafe": {
            "address": process.env.sepoliaDeploymentAddress
        },
        "explorerURL": "https://sepolia.etherscan.io/"
    }
}
