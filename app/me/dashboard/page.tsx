"use client";

import React, {useEffect, useState} from 'react'
import {useAppSelector} from "@/store/store";
import NoProfileFound from "@/components/no_profile_found";
import RenderDashboardHome from "@/components/render_dashboard_with_profile";
import Loading from "@/app/loading";

const DashboardPage = () => {
    const {blockchain, user, authenticated, wallet} = useAppSelector(state => state.app);
    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkIfBlockchainProfileExists = async () => {
            if(user == null) return ;
            if(blockchain == null) return ;
            const exists = await blockchain.doesUserProfileExist(wallet!.address);
            console.log('exists', exists);
            setLoading(false);
            setProfileExists(exists);
        }

       checkIfBlockchainProfileExists();
    }, [blockchain, user, wallet]);

    return (
        <>
            {
                !profileExists && !loading && (
                    <NoProfileFound />
                )
            }
            {
                profileExists && !loading && (
                    <RenderDashboardHome />
                )
            }
            {
                loading && <Loading loadMessage='Opening dashboard....' />
            }
        </>
    )
}
export default DashboardPage
