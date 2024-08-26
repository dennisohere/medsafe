import React from 'react'
import {usePrivy} from "@privy-io/react-auth";
import Link from "next/link";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";

const Navbar = () => {
    const {ready, authenticated, logout} = usePrivy();
    const {displayName, blockchain} = useAppSelector((state) => state.app)
    const router = useRouter();

    const logoutUser = async () => {
        await logout();
        router.replace('/');
    }

    return (
        <div className='w-full bg-base-100'>
            <div className="navbar  max-w-screen-xl mx-auto">
                <div className="flex-1">
                    <Link href='/' className="btn btn-ghost text-2xl gap-0">
                        <span className=" text-rose-600">Med</span>
                        <span className='font-bold '>Safe</span>
                    </Link>
                    {
                        ready && authenticated && (
                            <>
                                {
                                    blockchain?.isPatient() && (
                                        <span><Badge>Patient</Badge></span>
                                    )
                                }
                                {
                                    blockchain?.isPhysician() && (
                                        <span><Badge>Physician</Badge></span>
                                    )
                                }
                                {
                                    !blockchain?.currentUserRole && (
                                        <Badge variant='destructive'>No profile found!</Badge>
                                    )
                                }
                            </>
                        )
                    }
                </div>
                <div className="flex-none">
                    {
                        ready && authenticated && (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost avatar">
                                    <span>{`${displayName ?? 'Hello'}`}</span>

                                    <div className="w-8 rounded-full ">

                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li><Link href=''>Dashboard</Link></li>
                                    <li onClick={logoutUser}><span className='text-rose-800'>Logout</span></li>
                                </ul>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
}
export default Navbar
