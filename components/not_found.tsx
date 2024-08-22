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

const NotFound = ({title, subtitle}: {title : string, subtitle?: string | undefined}) => {

    return (
        <div className='grow place-items-center flex flex-col justify-center'>
            <Image src={developApp} alt='site setup' width={300}  />
            <div className='mt-11 flex flex-col justify-center text-center gap-y-4'>
                <h1 className='text-3xl text-slate-700'>{title}</h1>
                {
                    !!subtitle && (
                        <div>{subtitle}</div>
                    )
                }
            </div>
        </div>
    )
}
export default NotFound
