"use client";

import React, {useEffect, useState} from 'react'
import {useParams, redirect, useRouter, useSearchParams} from "next/navigation";
import {useAppSelector} from "@/store/store";
import {IMedicalRecord, IPatientData, IPhysicianData} from "@/lib/types";
import RenderPhysicianProfileData from "@/components/render_physician_profile_data";
import {Button} from "@/components/ui/button";
import Loading from "@/app/loading";
import NotFound from "@/components/not_found";
import RenderPatientProfileData from "@/components/render_patient_profile_data";
import {ArrowLeft, Plus} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import RenderMedicalRecordForm from "@/components/render_medical_record_form";

const ManagePatientMedicalRecords = () => {
    const {blockchain, user} = useAppSelector(state => state.app);
    const searchParams = useSearchParams();

    const [patientData, setPatientData] = useState<IPatientData | null>(null);
    const [loading, setLoading] = useState(true);
    const [patientUserId, setPatientUserId] = useState('');
    const [medRecords, setMedRecords] = useState<IMedicalRecord[]>([]);
    const {push} = useRouter();

    useEffect(() => {
        const initPatientDetails = async () => {
            if(user == null) return ;
            if(blockchain == null) return ;
            setPatientUserId(searchParams.get('patientUserId')!);
            const data = await blockchain.getPatient(patientUserId);

            if(!!data){
                setPatientData(data);
            }

            setMedRecords(await blockchain.getPatientRecords(patientUserId));

            setLoading(false);
        }
        initPatientDetails();
    }, [blockchain, patientUserId, searchParams, user]);


    return (
        <>
            {
                loading && (
                    <Loading />
                )
            }
            {
                !loading && !patientData && (
                    <NotFound title='Patient not found!' />
                )
            }
            {
                !loading && !!patientData && (
                    <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-y-5 py-8">
                        <div>
                            <Button size='sm' variant='ghost' onClick={()=>push("/me/dashboard")}>
                                <ArrowLeft /> Back
                            </Button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-6 w-full mx-auto'>
                            <div>
                                <RenderPatientProfileData showControls={false} patientProfileData={patientData}
                                                          title='Patient Profile'/>
                            </div>

                            <div className='col-span-2'>
                                <div className="px-10 py-6 flex flex-col gap-x-6 w-full gap-y-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-xl text-slate-700">Medical Records</h3>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size='sm' variant='default'>
                                                    <Plus/> Add Record
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Add Medical Record</DialogTitle>
                                                    <DialogDescription>
                                                        Indicate the diagnosis and treatment for this patient
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <RenderMedicalRecordForm patientUserId={patientUserId}/>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md">
                                        <table className="table">
                                            {/* head */}
                                            <thead>
                                            <tr>
                                                <th></th>
                                                <th>Diagnosis</th>
                                                <th>Treatment</th>
                                                <th>Date</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                medRecords.map((record, index) => (
                                                    <tr key={index} className='hover:bg-gray-50 cursor-pointer'>
                                                        <th>{index + 1}</th>
                                                        <td><span
                                                            className='font-bold'>{record.diagnosis}</span>
                                                        </td>
                                                        <td>{record.treatment}</td>
                                                        <td>
                                                            <span>{record.timestamp.toDateString()}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default ManagePatientMedicalRecords
