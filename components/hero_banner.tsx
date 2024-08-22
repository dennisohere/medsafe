"use client";

import React from 'react'
import {usePrivy} from "@privy-io/react-auth";
import Link from "next/link";
import LoginButton from "@/components/login_button";

const HeroBanner = () => {
    const {ready, authenticated} = usePrivy();

    return (
    <section
        className="relative bg-[url(/images/banner.jpg)] bg-cover bg-center bg-no-repeat"
    >
        <div
            className="absolute inset-0  bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 sm:bg-gradient-to-r "
        ></div>

        <div
            className="relative mx-auto max-w-screen-xl py-32 sm:px-6 flex h-screen items-center px-8"
        >
            <div className="max-w-xl text-center sm:text-left">
                <h1 className="text-3xl font-light text-white sm:text-4xl">
                    Securing Healthcare Data with
                    <strong className="block font-bold text-rose-300 sm:text-5xl">Blockchain Technology</strong>
                </h1>

                <p className="mt-8 max-w-xl text-white sm:text-xl/relaxed">
                    MedSafe harnesses the power of blockchain technology to provide unparalleled security
                    for Electronic Health Records (EHRs). Our innovative Web3 application ensures that your
                    patients&apos; data remains confidential, tamper-proof, and accessible only to authorized personnel.
                </p>

                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start text-center">
                    {
                        ready && authenticated && (
                            <Link
                                href="/me/dashboard"
                                className="rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
                            >
                                Go to dashboard
                            </Link>
                        )
                    }

                    {
                        ready && !authenticated && (
                            <LoginButton />
                        )
                    }


                </div>
            </div>
        </div>
    </section>

)
}
export default HeroBanner
