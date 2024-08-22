import React, {useEffect, useState} from 'react'
import {IPatientData, IPhysicianData} from "@/lib/types";
import {useAppSelector} from "@/store/store";
import {Button} from "@/components/ui/button";
import Loading from "@/app/loading";
import {useRouter} from 'next/navigation'

const RenderPatientProfileData = ({title = 'Profile data', patientProfileData, showControls = true}:
                                      {title?: string | undefined,
                                          patientProfileData? : IPatientData | undefined,
                                          showControls?: boolean
                                      }) => {
    const [patientData, setPatientData] = useState<IPatientData>({
        contactAddress: "",
        contactPhoneNumber: "",
        dateOfBirth: "",
        emergencyContactAddress: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        firstName: "",
        gender: "",
        lastName: ""
    })
    const [authorisedPhysician, setAuthorisedPhysician] =
        useState<IPhysicianData | undefined | null>(undefined)

    const [loading, setLoading] = React.useState(true)
    const {blockchain, user} = useAppSelector(state => state.app);
    const {refresh} = useRouter();


    useEffect(() => {
        const init = async () => {
            if(user == null) return ;
            if(blockchain == null) return ;

            if(!patientProfileData){
                setPatientData(await blockchain.getPatient(user.id));

                setAuthorisedPhysician(await blockchain.getPatientAuthorisedPhysician());
            } else {
                setPatientData(patientProfileData);
            }

            setLoading(false);
        }

        init();
    }, [blockchain, user, patientProfileData]);

    const revokeAuthorisedPhysician = async () => {
        await blockchain!.revokePatientAuthorisedPhysician();
        refresh();
    }

    return (
        <>
            {
                loading && <Loading />
            }
            {!loading && (
                <div className='flex flex-col items-center w-full mx-auto gap-y-12'>
                    <div className="card bg-base-100 w-full shadow-xl">
                        <div className="card-body">
                            <h3 className="text-xl font-bold mb-5">{title}</h3>
                            <div className="flex flex-col gap-y-5">
                                <div className='grid grid-cols-2'>
                                    <span>First name</span>
                                    <span className='font-medium'>{patientData.firstName}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Last name</span>
                                    <span className='font-medium'>{patientData.lastName}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Gender</span>
                                    <span className='font-medium'>{patientData.gender}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Date of birth:</span>
                                    <span className='font-medium'>{patientData.dateOfBirth}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Phone</span>
                                    <span className='font-medium'>{patientData.contactPhoneNumber}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Contact Address</span>
                                    <span className='font-medium'>{patientData.contactAddress}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Emergency Contact</span>
                                    <span className='font-medium'>{patientData.emergencyContactName}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Emergency phone</span>
                                    <span className='font-medium'>{patientData.emergencyContactPhone}</span>
                                </div>
                                <div className='grid grid-cols-2'>
                                    <span>Emergency Contact Address</span>
                                    <span className='font-medium'>{patientData.emergencyContactAddress}</span>
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
                        !!authorisedPhysician && (
                            <div className="w-full px-14 py-8 border border-slate-700 rounded-lg">
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold mb-5">Authorised Physician</h3>
                                        <Button variant='destructive' size='sm' onClick={revokeAuthorisedPhysician}>
                                            Revoke
                                        </Button>
                                    </div>

                                    <div className='grid grid-cols-2'>
                                        <span>Name</span>
                                        <span className='font-medium'>
                                    {authorisedPhysician.firstName} {authorisedPhysician.lastName}
                                </span>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <span>Gender</span>
                                        <span className='font-medium'>{authorisedPhysician.gender}</span>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <span>Email</span>
                                        <span className='font-medium'>{authorisedPhysician.email}</span>
                                    </div>
                                    <div className='grid grid-cols-2'>
                                        <span>Specialty</span>
                                        <span className='font-medium'>{authorisedPhysician.specialty}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            )}
        </>
    )
}
export default RenderPatientProfileData

