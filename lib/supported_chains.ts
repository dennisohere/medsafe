import {Chain, defineChain} from "viem";
import {polygonAmoy, sepolia} from "viem/chains";
import dotenv from "dotenv";

dotenv.config();

export const localhost = defineChain({
    nativeCurrency: {
        name: 'Localhost ETH',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545']
        }
    },
    id: 31337,
    name: 'Localhost Eth',
    network: 'localhost',
    chainId: 31337,
});


export type SupportedChain = 'localhost' | 'sepolia' | 'polygonAmoy';

// @ts-ignore
export const supportedChainsConfig : Map<SupportedChain, Chain> = new Map([
    ['localhost', localhost],
    ['sepolia', sepolia],
    ['sepolia', sepolia],
    ['polygonAmoy', polygonAmoy],
]);

console.log('env', process.env);

export const selectedChain =
    supportedChainsConfig.get(<SupportedChain>`${process.env.defaultNetwork}`);


