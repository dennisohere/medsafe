import React, {useEffect, useState} from 'react'
import {IMedicalRecord} from "@/lib/types";
import {useAppSelector} from "@/store/store";

const RenderPatientMedicalRecords = () => {
    const [medRecords, setMedRecords] = useState<IMedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const {blockchain, user} = useAppSelector(state => state.app);

    useEffect(() => {
        const init = async () => {
            if(user == null) return ;
            if(blockchain == null) return ;

            setMedRecords(await blockchain.getPatientRecords(user.id));

            setLoading(false);
        }
        init();
    }, [blockchain, user]);

    return (
        <div className="flex justify-center max-w-screen-xl w-full mx-auto">
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
    )
}
export default RenderPatientMedicalRecords
