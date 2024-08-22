"use client";

import React, {useEffect, useState} from 'react'
import {useAppSelector} from "@/store/store";
import Loading from "@/app/loading";
import {setBlockchain} from "@/store/appSlice";

const AuthenticatedLayout = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    const {blockchain, user} = useAppSelector(state => state.app);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState(0);


    useEffect(() => {
        const init = async () => {
            console.log("authLayout:init", currentUserRole);
            if(user == null) return ;
            if(blockchain == null) return ;
            await blockchain.initUserRole(user.id);
            setCurrentUserRole(blockchain.currentUserRole!);
            console.log('authLayout: user role', blockchain.currentUserRole, currentUserRole);
            setBlockchain(blockchain);
            setLoading(false);
        }

        init();
    }, [blockchain, currentUserRole, loading, user]);

    return (
        <>
            {loading && <Loading loadMessage='Setting up your account...' />}
            {!loading && (
                <>
                    {children}
                </>
            )}
        </>
    )
}
export default AuthenticatedLayout
