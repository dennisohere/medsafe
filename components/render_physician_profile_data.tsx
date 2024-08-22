import React, {useEffect, useState} from 'react'
import {IPhysicianData} from "@/lib/types";
import {useAppSelector} from "@/store/store";
import {Button} from "@/components/ui/button";
import {DocumentDuplicateIcon, CheckCircleIcon, CheckIcon} from "@heroicons/react/24/outline";
import {useCopyToClipboard} from "usehooks-ts";

const RenderPhysicianProfileData = ({showControls = true, title = 'Profile data', physicianProfileData,}
                                        : {showControls?: boolean, title?: string, physicianProfileData?: IPhysicianData|undefined}
) => {
    const [physicianData, setPhysicianData] = useState<IPhysicianData>({
        firstName: "",
        gender: "",
        email: "",
        lastName: "",
        specialty: ""
    })

    const [loading, setLoading] = React.useState(true)
    const {blockchain, user} = useAppSelector(state => state.app);
    const [authorisationLink, setAuthorisationLink] = React.useState("");
    const [copied, setCopied] = React.useState(false);
    const [copiedText, copy] = useCopyToClipboard();

    const copyLink = async () => {
        await copy(authorisationLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    useEffect(() => {
        const init = async () => {
            if(!!physicianProfileData){
                setPhysicianData(physicianProfileData!);
                setLoading(false);
                return ;
            }
            if(user == null) return ;
            if(blockchain == null) return ;
            const physicianData = await blockchain.getPhysician(user.id);
            setPhysicianData(physicianData);

            const physicianAuthorisationLink = `${window.location.origin}/authorise/physician/${user!.wallet!.address}`;
            setAuthorisationLink(physicianAuthorisationLink);
            setLoading(false);
        }

        init();
    }, [blockchain, user]);


    return (
        <div className='flex justify-center max-w-screen-xl w-full mx-auto'>
            <div className="w-full md:w-1/2 flex flex-col gap-y-10">
                <div className="card bg-base-100  shadow-xl">
                    <div className="card-body">
                        <h3 className="text-xl font-bold mb-5">{title}</h3>
                        <div className="flex flex-col gap-y-5">
                            <div className='grid grid-cols-2'>
                                <span>First name</span>
                                <span className='font-medium'>{physicianData.firstName}</span>
                            </div>
                            <div className='grid grid-cols-2'>
                                <span>Last name</span>
                                <span className='font-medium'>{physicianData.lastName}</span>
                            </div>
                            <div className='grid grid-cols-2'>
                                <span>Email</span>
                                <span className='font-medium'>{physicianData.email}</span>
                            </div>
                            <div className='grid grid-cols-2'>
                                <span>Gender</span>
                                <span className='font-medium'>{physicianData.gender}</span>
                            </div>
                            <div className='grid grid-cols-2'>
                                <span>Specialty</span>
                                <span className='font-medium'>{physicianData.specialty}</span>
                            </div>
                        </div>

                        {
                            showControls && (
                                <div className="card-actions mt-12 flex justify-center">
                                    <Button>
                                        Update profile data
                                    </Button>
                                </div>
                            )
                        }

                    </div>

                </div>

                {
                    showControls && (
                        <div className="text-slate-700 flex flex-col gap-y-1 text-center max-w-96 mx-auto ">
                            <span>Authorisation link:</span>
                            <div className="flex justify-center gap-x-2 ">
                                <span
                                    className='text-sm text-wrap overflow-hidden overflow-ellipsis grow'>{authorisationLink}</span>
                                <span className='cursor-pointer hover:text-rose-700' onClick={() => copyLink()}>
                            {
                                copied && (
                                    <CheckIcon height={20} width={20}/>
                                )
                            }
                                    {
                                        !copied && (
                                            <DocumentDuplicateIcon height={20}/>
                                        )
                                    }
                        </span>
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
}
export default RenderPhysicianProfileData

