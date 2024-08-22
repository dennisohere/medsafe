"use client";

import React, {useEffect} from 'react'
import PatientOnboardingForm from "@/components/patient_onboarding_form";

const OnboardingPage = () => {

    return (
        <div className='grow place-items-center flex flex-col justify-center'>
            <PatientOnboardingForm />
        </div>
    )
}
export default OnboardingPage
