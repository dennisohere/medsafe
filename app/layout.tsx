"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import {PrivyProvider} from "@privy-io/react-auth";
import Navbar from "@/components/navbar";
import {cn} from "@/lib/utils";

import App from "@/components/app";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import {polygonAmoy, sepolia} from "viem/chains";
import {localhost, selectedChain} from "@/lib/supported_chains";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-screen bg-slate-100')}>
      <PrivyProvider
          appId="clzwfhfet06jhlf1ii58ghty4"
          config={{
            // Customize Privy's appearance in your app
            appearance: {
              theme: 'light',
              accentColor: '#676FFF',
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
              loginMethods: ['email', 'wallet', 'google'],
              defaultChain: selectedChain,
              supportedChains: [
                  localhost,
                  sepolia,
                  polygonAmoy
              ]
          }}
      >
          <Provider store={store}>
              <App>
                  <Navbar />
                  {children}
              </App>
          </Provider>
      </PrivyProvider>
      </body>
    </html>
  );
}
