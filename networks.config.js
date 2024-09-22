

export const networkConfig = {
    "31337": {
        "medSafe": {
            "address": process.env.localhostDeploymentAddress
        },
        "explorerURL": "#",
        "rpcURL": "#",
    },
    "80002": {
        "medSafe": {
            "address": process.env.polygonAmoyDeploymentAddress
        },
        "explorerURL": "https://www.oklink.com/amoy/tx/",
        "rpcUrl": process.env.polygonAmoyApiUrl,
        "paymaster": {
            "bundlerUrl": process.env.polygonAmoyBundlerUrl,
            "apiKey": process.env.polygonAmoyPaymasterApiKey
        }
    },
    "11155111": {
        "medSafe": {
            "address": process.env.sepoliaDeploymentAddress
        },
        "explorerURL": "https://sepolia.etherscan.io/tx/",
        "rpcUrl": process.env.sepoliaApiUrl,
        "paymaster": {
            "bundlerUrl": process.env.sepoliaBundlerUrl,
            "apiKey": process.env.sepoliaPaymasterApiKey
        }
    }
}
