import React from 'react'
import Image from "next/image";
import developApp from '@/assets/svg/develop_app.svg';
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Link from "next/link";

const NoProfileFound = () => {

    return (
        <div className='grow place-items-center flex flex-col justify-center'>
            <Image src={developApp} alt='site setup' width={300}  />
            <div className='mt-11 flex flex-col justify-center text-center gap-y-4'>
                <h1 className='text-3xl text-slate-700'>No profile found</h1>
                <div>Your profile do not exist on the blockchain</div>
                <div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                Setup my account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle asChild>
                                    <h1 className="text-3xl mb-4">
                                        Select an option which describes you
                                    </h1>
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <div className='flex flex-col justify-center gap-y-6'>
                                        <Link href='/me/onboarding/physician'
                                            className='cursor-pointer transition-all duration-200 text-lg px-8 py-4 border border-gray-200 rounded-lg hover:text-rose-500 hover:border-rose-300'>
                                            I provide care services (e.g. a physician)
                                        </Link>
                                        <Link href='/me/onboarding/patient'
                                              className='cursor-pointer transition-all duration-200 text-lg px-8 py-4 border border-gray-200 rounded-lg hover:text-rose-500 hover:border-rose-300'>
                                            I receive care services (e.g. a patient)
                                        </Link>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </div>
    )
}
export default NoProfileFound
