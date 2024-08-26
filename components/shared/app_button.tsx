import React, {forwardRef, useEffect, useState} from 'react'
import {ButtonProps} from "react-day-picker";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

export type AppButtonState = 'initial' | 'loading' | 'error';

interface AppButtonProps extends ButtonProps {
    state?: AppButtonState;
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>((props, ref) => {
    const {state, onClick, children, ...otherProps} = props
    const [currentButtonState, setCurrentButtonState] = useState<AppButtonState>(state || 'initial')

    useEffect(() => {
        setCurrentButtonState(state || 'initial');
    }, [state])

    const buttonClicked = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentButtonState('loading')
        try {
            if (onClick) {
                onClick(event)
            }
            setCurrentButtonState('initial')
        } catch (error){
            console.error('button clicked: error', error);
            setCurrentButtonState('error')
        }
    }

    return (
        <Button {...props} disabled={currentButtonState === 'loading'} onClick={buttonClicked} ref={ref}>
            {
                currentButtonState === 'initial' && children
            }
            {
                currentButtonState === 'loading' && (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </>
                )
            }
        </Button>
    )
})

AppButton.displayName = "Button"

export default AppButton
