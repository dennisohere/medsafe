import React, {useEffect} from 'react'
import {IPatientData} from "@/lib/types";
import Loading from "@/app/loading";
import NotFound from "@/components/not_found";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";

const RenderAssignedPatients = () => {
    const [loading, setLoading] = React.useState(true)
    const [patients, setPatients] = React.useState<IPatientData[]>([])
    const {blockchain} = useAppSelector(state => state.app);
    const router = useRouter();

    useEffect(() => {
        const getAssignedPatients = async () => {
            if(blockchain == null) return ;

            const assignedPatients = await blockchain.getPatientsAssignedToPhysician();
            setPatients(assignedPatients);
            setLoading(false);
            console.log('getAssignedPatients', assignedPatients);
        }

        getAssignedPatients();
    }, [blockchain]);

    const openPatientRecords = (patient: IPatientData) => {
        const url = new URL(window.location.origin + '/me/patients/');
        url.searchParams.set('patientUserId', patient.userId!);
        router.push(url.href)
    }

    return (
        <div className='w-full gap-y-12'>

            {
                loading && <Loading />
            }
            {
                !loading && patients.length > 0 && (
                    <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>Patient names</th>
                                <th>Gender</th>
                                <th>Address / Phone</th>
                                <th>Emergency Contact</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                patients.map((patient, index) => (
                                    <tr key={index} className='hover:bg-gray-50 cursor-pointer'
                                    onClick={() => openPatientRecords(patient)}>
                                        <th>{index + 1}</th>
                                        <td><span
                                            className='font-bold'>{patient.firstName} {patient.lastName}</span></td>
                                        <td>{patient.gender}</td>
                                        <td>
                                            <div className='flex flex-col'>
                                                <span>{patient.contactAddress}</span>
                                                <span>{patient.contactPhoneNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='flex flex-col'>
                                                    <span>
                                                        {patient.emergencyContactName}
                                                    </span>
                                                <span
                                                    className='text-sm text-slate-700'>({patient.emergencyContactPhone})</span>
                                            </div>

                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                !loading && patients.length == 0 && (
                    <NotFound title='Patients Not Found!'/>
                )
            }

        </div>
    )
}
export default RenderAssignedPatients
