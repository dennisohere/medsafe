import {useState} from 'react'
import {AppButton, AppButtonState} from "@/components/shared/app_button";
import {usePrivy} from "@privy-io/react-auth";
import {useAppSelector} from "@/store/store";
import {setWalletBalance} from "@/store/appSlice";
import {useDispatch} from "react-redux";


const WalletFundSeeder = () => {
    const {walletBalance, blockchain,wallet} = useAppSelector((state) => state.app)
    const dispatch = useDispatch();
    const [buttonState, setButtonState] = useState<AppButtonState>('initial');


    const getSeedEth = async () => {
        if(blockchain == null) return ;
        if(wallet == null) return ;
        setButtonState('loading');

        await blockchain.seedFundToWallet(wallet.address)

        const bal = await blockchain.getWalletBalance()
        dispatch(setWalletBalance(parseFloat(bal)));
        setButtonState('initial')
    }

    return (
        <div className='flex items-center justify-between gap-x-3 py-2 w-full px-3'>
            <div>{walletBalance.toFixed(7)} ETH</div>
            <AppButton state={buttonState} onClick={getSeedEth}>Get Seed ETH</AppButton>
        </div>
    )
}
export default WalletFundSeeder
