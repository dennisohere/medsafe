import React, {useEffect} from 'react'
import {Provider, useDispatch} from "react-redux";
import {ConnectedWallet, usePrivy, useWallets} from "@privy-io/react-auth";
import {initializeContract} from "@/lib/smart_contract";
import {setAuthenticated, setBlockchain, setDisplayName, setUser, setWallet} from "@/store/appSlice";
import {selectedChain} from "@/lib/supported_chains";
import {Blockchain} from "@/lib/services/blockchain";
import {BlockchainWithGasSponsorship} from "@/lib/services/blockchain_with_gas_sponsorship";


const App = ({children}: Readonly<{ children: React.ReactNode; }>) => {
    console.log('render app');
    const {wallets} = useWallets();
    const {ready, authenticated, user} = usePrivy();
    const dispatch = useDispatch();
    let wallet: ConnectedWallet | null = null;

    const init = async () => {
        wallet = wallets[0];

        dispatch(setUser(user));
        dispatch(setAuthenticated(authenticated));
        dispatch(setWallet(wallet));

        const userEmail = ready && authenticated ? (user?.email?.address || user?.google?.email) : null;
        dispatch(setDisplayName(userEmail));

        if(!!wallet){
            const {contract, smartAccount} = await initializeContract(wallet, selectedChain!.id!.toString())
            const blockchain = new BlockchainWithGasSponsorship(contract, smartAccount);
            console.log('app:', blockchain, contract)
            dispatch(setBlockchain(blockchain));
        }

    }

    useEffect(() => {
        init();
    });

    return (
        <div className='min-h-screen flex flex-col'>{children}</div>
    )
}
export default App
