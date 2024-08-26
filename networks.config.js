

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
        "explorerURL": "https://www.oklink.com/amoy/",
        "paymaster": {
            "bundlerUrl": process.env.polygonAmoyBundlerUrl,
            "apiKey": process.env.polygonAmoyPaymasterApiKey
        }
    },
    "11155111": {
        "medSafe": {
            "address": process.env.sepoliaDeploymentAddress
        },
        "explorerURL": "https://sepolia.etherscan.io/",
        "paymaster": {
            "bundlerUrl": process.env.sepoliaBundlerUrl,
            "apiKey": process.env.sepoliaPaymasterApiKey
        }
    }
}
