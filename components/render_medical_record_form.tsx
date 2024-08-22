"use client";

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {usePrivy} from "@privy-io/react-auth";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {MedicalRecordFormSchema, PhysicianFormSchema} from "@/lib/utils";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";



const RenderMedicalRecordForm = ({patientUserId}: {patientUserId: string}) => {
    const {ready} = usePrivy();
    const {blockchain, user} = useAppSelector(state => state.app);
    const router = useRouter();

    const form = useForm<z.infer<typeof MedicalRecordFormSchema>>({
        resolver: zodResolver(MedicalRecordFormSchema),
        defaultValues: {
            diagnosis: '',
            treatment: '',
            physicianUserId: user?.id || ''
        },
    })


    const onSubmit = async (formData: z.infer<typeof MedicalRecordFormSchema>) => {
        console.log('medical record data', formData);

        await blockchain!.addMedicalRecord(
            patientUserId,
            formData.physicianUserId,
            formData.diagnosis,
            formData.treatment,
        );

        form.reset();
        router.refresh();
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


                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default RenderMedicalRecordForm;
