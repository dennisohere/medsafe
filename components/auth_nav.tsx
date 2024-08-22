import React, {useEffect, useState} from 'react'
import {AllowedAuthNavLink, IAuthNavLink} from "@/lib/types";
import {useAppSelector} from "@/store/store";
import Image from "next/image";
import medicalRecordIcon from '@/assets/svg/medical_record_icon.svg'
import homeIcon from '@/assets/svg/home_icon.svg'
import {setSelectedDashboardTab} from "@/store/appSlice";
import {useDispatch} from "react-redux";


const AuthNav = ({defaultTab}: {defaultTab?: AllowedAuthNavLink | undefined}) => {
    const [loading, setLoading] = React.useState(true)
    const {blockchain, user, selectedDashboardTab} = useAppSelector(state => state.app);
    const [isPatient, setIsPatient] = useState(false);
    const [isPhysician, setIsPhysician] = useState(false);
    const dispatch = useDispatch();

    const [navLinks, setNavLinks] = useState<IAuthNavLink[]>([
        {
            label: 'Home',
            iconPath: homeIcon,
        }
    ]);

    useEffect(() => {

        const init = () => {
            if(user == null) return ;
            if(blockchain == null) return ;

            if(!isPatient) {
                setIsPatient(blockchain.isPatient())
                if(blockchain.isPatient()) {
                    setNavLinks([...navLinks, {
                        label: 'Medical Records',
                        iconPath: medicalRecordIcon,
                    }]);
                }
            }

            if(!isPhysician) {
                setIsPhysician(blockchain.isPhysician())
                if(blockchain.isPhysician()) {
                    setNavLinks([...navLinks, {
                        label: 'Patients',
                        iconPath: medicalRecordIcon,
                    }]);
                }
            }

            if(!!defaultTab){
                setSelectedDashboardTab(defaultTab);
            }

            setLoading(false);
        }
        init();
    }, [isPatient, blockchain, user, selectedDashboardTab, isPhysician]);

    return (
        <div className="max-w-screen-xl mx-auto pt-7">
            <ul className="menu lg:menu-horizontal rounded-box">
                {
                    !loading && navLinks.map((item, i) => (
                        <li key={i}>
                            <a onClick={() => dispatch(setSelectedDashboardTab(navLinks[i].label))}
                               className={`${selectedDashboardTab == navLinks[i].label ? 'bg-slate-200' : ''}`}>

                                <Image src={navLinks[i].iconPath} alt={navLinks[i].label} height={20} width={20} />

                                {navLinks[i].label}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
export default AuthNav
