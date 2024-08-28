import {abi} from '@/blockchain/artifacts/contracts/MedSafe.sol/MedSafe.json'
import {ConnectedWallet} from "@privy-io/react-auth";
import {ethers} from "ethers";
import {networkConfig} from "@/networks.config";


export const initializeContract = async (wallet: ConnectedWallet, selectedNetworkId: string) => {

    if(wallet.chainId !== selectedNetworkId) {
        await wallet.switchChain(parseInt(selectedNetworkId));
    }

    const provider = await wallet.getEthersProvider();

    // @ts-ignore
    const contractAddress = networkConfig[selectedNetworkId].medSafe.address;
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const usePaymaster = !!process.env.usePaymaster;

    return {
        contract,
        contractAddress,
        provider,
        signer,
        usePaymaster,
    };
}
