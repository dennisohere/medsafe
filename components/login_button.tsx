"use client";

import {useLogin, usePrivy} from '@privy-io/react-auth';
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/store/store";
import {setAuthenticated, setUser} from "@/store/appSlice";


const LoginButton = () => {
    const dispatch = useAppDispatch();

    const {login} = useLogin({
        onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            // console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);
            // Any logic you'd like to execute if the user is/becomes authenticated while this
            // component is mounted
            // todo: redirect to onboarding
            dispatch(setUser(user));
            dispatch(setAuthenticated(true))
        },
        onError: (error) => {
            console.log(error);
            // Any logic you'd like to execute after a user exits the login flow or there is an error
        },
    });

    const {ready, authenticated} = usePrivy();
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <Button className='rounded bg-rose-600 px-14 text-sm font-medium text-white shadow hover:bg-rose-700'
            disabled={disableLogin} onClick={login}>
            Get started
        </Button>
    );
}

export default LoginButton;
