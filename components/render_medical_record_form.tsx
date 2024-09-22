"use client";

import * as React from "react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {MedicalRecordFormSchema} from "@/lib/utils";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";
import {AppButton, AppButtonState} from "@/components/shared/app_button";



const RenderMedicalRecordForm = ({patientUserId}: {patientUserId: string}) => {
    const {blockchain, user} = useAppSelector(state => state.app);
    const router = useRouter();
    const [buttonState, setButtonState] = React.useState<AppButtonState>('initial');

    const form = useForm<z.infer<typeof MedicalRecordFormSchema>>({
        resolver: zodResolver(MedicalRecordFormSchema),
        defaultValues: {
            diagnosis: '',
            treatment: '',
            physicianUserId: user?.id || ''
        },
    })


    const onSubmit = async (formData: z.infer<typeof MedicalRecordFormSchema>) => {
        setButtonState('loading');
        console.log('medical record data', formData);

        await blockchain!.addMedicalRecord(
            patientUserId,
            formData.physicianUserId,
            formData.diagnosis,
            formData.treatment,
        );

        form.reset();
        setButtonState('initial');
        // router.refresh();
    }


    return (
        <Card className="">
            <CardContent className='py-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diagnosis</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name='diagnosis'/>

                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Treatment</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name='treatment'/>


                        <AppButton state={buttonState} type="submit">Submit</AppButton>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default RenderMedicalRecordForm;
