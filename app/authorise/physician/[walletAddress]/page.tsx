"use client";

import React, {useEffect, useState} from 'react'
import {useParams, redirect, useRouter} from "next/navigation";
import {useAppSelector} from "@/store/store";
import {IPhysicianData} from "@/lib/types";
import RenderPhysicianProfileData from "@/components/render_physician_profile_data";
import {Button} from "@/components/ui/button";
import Loading from "@/app/loading";
import NotFound from "@/components/not_found";

const AuthorisePhysicianPage = () => {
    const {blockchain, user} = useAppSelector(state => state.app);
    const {walletAddress}  = useParams();
    const [physicianData, setPhysicianData] = useState<IPhysicianData | null>(null);
    const [loading, setLoading] = useState(true);
    const {push} = useRouter();

    useEffect(() => {
        const getPhysicianDetails = async () => {
            console.log('wallet address ', walletAddress);
            if(user == null) return ;
            if(blockchain == null) return ;

            const data = await blockchain.getPhysicianByAddress(walletAddress.toString());

            if(!!data){
                setPhysicianData(data);
            }
            setLoading(false);
        }
        getPhysicianDetails();
    }, [blockchain, walletAddress]);

    const authorisePhysicianPage = async () => {
        await blockchain!.setPatientAuthorisedPhysician(user!.id, physicianData!.userId!);
        alert('Physician has been successfully authorised!');
        push('/me/dashboard')
    }

    return (
        <>
            {
                loading && (
                    <Loading />
                )
            }
            {
                !loading && !physicianData && (
                    <NotFound title='Physician not found!' />
                )
            }
            {
                !loading && !!physicianData && (
                    <div className='flex flex-col place-items-center justify-center py-10 max-w-screen-xl w-full mx-auto'>
                        {
                            !!physicianData && (
                                <RenderPhysicianProfileData showControls={false} title='Physician Details'
                                                            physicianProfileData={physicianData!}/>
                            )
                        }

                        <div>
                            <Button onClick={authorisePhysicianPage}>Authorise physician</Button>
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default AuthorisePhysicianPage
