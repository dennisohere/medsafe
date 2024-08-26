import {abi} from '@/blockchain/artifacts/contracts/MedSafe.sol/MedSafe.json'
import {ConnectedWallet} from "@privy-io/react-auth";
import {ethers} from "ethers";
import {networkConfig} from "@/networks.config";
import {createSmartAccountClient} from "@biconomy/account";


export const initializeContract = async (wallet: ConnectedWallet, selectedNetworkId: string) => {

    if(wallet.chainId !== selectedNetworkId) {
        await wallet.switchChain(parseInt(selectedNetworkId));
    }

    const provider = await wallet.getEthersProvider();

    // @ts-ignore
    const contractAddress = networkConfig[selectedNetworkId].medSafe.address;
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const smartAccount = await createSmartAccountClient({
        signer: signer,
        bundlerUrl: process.env.sepoliaBundlerUrl!,
        biconomyPaymasterApiKey: process.env.paymasterApiKey!,
    });

    return {
        contract,
        contractAddress,
        provider,
        smartAccount,
    };
}
