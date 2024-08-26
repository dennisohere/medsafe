import {abi} from '@/blockchain/artifacts/contracts/MedSafe.sol/MedSafe.json'
import {ConnectedWallet} from "@privy-io/react-auth";
import {ethers} from "ethers";
import {networkConfig} from "@/networks.config";
import {BiconomySmartAccountV2, createSmartAccountClient} from "@biconomy/account";


export const initializeContract = async (wallet: ConnectedWallet, selectedNetworkId: string) => {

    if(wallet.chainId !== selectedNetworkId) {
        await wallet.switchChain(parseInt(selectedNetworkId));
    }

    const provider = await wallet.getEthersProvider();

    // @ts-ignore
    const contractAddress = networkConfig[selectedNetworkId].medSafe.address;
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // @ts-ignore
    const {bundlerUrl, apiKey} = networkConfig[selectedNetworkId]!.paymaster;


    let smartAccount: BiconomySmartAccountV2 | undefined;

    if(!!bundlerUrl && !!apiKey){
        smartAccount = await createSmartAccountClient({
            signer: signer,
            bundlerUrl: bundlerUrl,
            biconomyPaymasterApiKey: apiKey,
        });
    }

    return {
        contract,
        contractAddress,
        provider,
        smartAccount,
    };
}
