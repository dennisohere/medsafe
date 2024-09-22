import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {ConnectedWallet, User} from "@privy-io/react-auth";
import {AllowedAuthNavLink} from "@/lib/types";
import {Blockchain} from "@/lib/services/blockchain";

export interface IAppState {
    authenticated: boolean;
    wallet?: ConnectedWallet | null | undefined;
    user?: User | undefined | null;
    blockchain?: Blockchain | undefined;
    displayName?: string | undefined | null;
    selectedDashboardTab: AllowedAuthNavLink;
    walletBalance: number;
}

const initialState: IAppState = {
    authenticated: false,
    wallet: undefined,
    user: undefined,
    blockchain: undefined,
    displayName: undefined,
    selectedDashboardTab: 'Home',
    walletBalance: 0,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setWallet: (state, action: PayloadAction<ConnectedWallet | null>) => {
            state.wallet = action.payload;
        },
        setBlockchain: (state, action: PayloadAction<Blockchain>) => {
            // @ts-ignore
            state.blockchain = action.payload;
        },
        setDisplayName: (state, action: PayloadAction<string | null | undefined>) => {
            state.displayName = action.payload;
        },
        setSelectedDashboardTab: (state, action: PayloadAction<AllowedAuthNavLink>) => {
            state.selectedDashboardTab = action.payload;
        },
        setWalletBalance: (state, action: PayloadAction<number>) => {
            state.walletBalance = action.payload;
            console.log('wallet balance: ', state.walletBalance);
        }
    },
});

export const {
    setAuthenticated,
    setUser,
    setWallet,
    setBlockchain,
    setDisplayName,
    setSelectedDashboardTab,
    setWalletBalance
} = appSlice.actions;
export const appReducer = appSlice.reducer;
