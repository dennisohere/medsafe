"use client";

import React, {useEffect, useState} from 'react'
import Loading from "@/app/loading";
import {useAppSelector} from "@/store/store";
import RenderPatientDashboard from "@/components/render_patient_dashboard";
import AuthNav from "@/components/auth_nav";
import RenderPhysicianDashboard from "@/components/render_physician_dashboard";


const RenderDashboardHome = () => {
    const [loading, setLoading] = React.useState(true)
    const {blockchain, user} = useAppSelector(state => state.app);
    const [isPatient, setIsPatient] = useState(false);
    const [isPhysician, setIsPhysician] = useState(false);

    const init = async () => {
        if(user == null) return ;
        if(blockchain == null) return ;
        setIsPatient(blockchain.isPatient());
        setIsPhysician(blockchain.isPhysician());
        setLoading(false);
    }


    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <AuthNav />
            {
                loading && <Loading loadMessage='Loading your dashboard... (Almost done!)' />
            }
            <div className='flex justify-center py-10 max-w-screen-xl w-full mx-auto'>
                {
                    !loading && isPatient && (
                        <RenderPatientDashboard />
                    )
                }
                {
                    !loading && isPhysician && (
                        <RenderPhysicianDashboard />
                    )
                }
            </div>

        </>
    )
}
export default RenderDashboardHome
