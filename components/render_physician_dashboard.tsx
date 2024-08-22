import React from 'react'
import {useAppSelector} from "@/store/store";
import RenderPhysicianProfileData from "@/components/render_physician_profile_data";
import RenderAssignedPatients from "@/components/render_assigned_patients";

const RenderPhysicianDashboard = () => {
    const {selectedDashboardTab} = useAppSelector(state => state.app);


    return (
        <>
            {
                selectedDashboardTab == 'Home' && (
                    <RenderPhysicianProfileData />
                )
            }
            {
                selectedDashboardTab == 'Patients' && (
                    <RenderAssignedPatients />
                )
            }
        </>
    );
}
export default RenderPhysicianDashboard
