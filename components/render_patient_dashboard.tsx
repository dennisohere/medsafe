import React from 'react'
import {useAppSelector} from "@/store/store";
import RenderPatientProfileData from "@/components/render_patient_profile_data";
import RenderPatientMedicalRecords from "@/components/render_patient_medical_records";

const RenderPatientDashboard = () => {
    const {selectedDashboardTab} = useAppSelector(state => state.app);


    return (
        <div className='w-full md:w-2/3 mx-auto'>
            {
                selectedDashboardTab == 'Home' && (
                    <RenderPatientProfileData />
                )
            }
            {
                selectedDashboardTab == 'Medical Records' && (
                    <RenderPatientMedicalRecords />
                )
            }
        </div>
    );
}
export default RenderPatientDashboard
