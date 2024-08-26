"use client";

import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
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
import {PhysicianFormSchema} from "@/lib/utils";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";
import {AppButton, AppButtonState} from "@/components/shared/app_button";


const PhysicianOnboardingForm = () => {
    const {ready} = usePrivy();
    const {blockchain, user, wallet} = useAppSelector(state => state.app);
    const router = useRouter();
    const [buttonState, setButtonState] = React.useState<AppButtonState>('initial');

    const form = useForm<z.infer<typeof PhysicianFormSchema>>({
        resolver: zodResolver(PhysicianFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            specialty: '',
        },
    })


    const onSubmit = async (formData: z.infer<typeof PhysicianFormSchema>) => {
        setButtonState('loading');

        await blockchain!.addPhysician(user!.id,
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.gender,
            formData.specialty,
        );

        form.reset();
        setButtonState('initial');
        router.push('/me/dashboard')
    }


    return (
        <Card className="w-[350px] sm:w-1/3">
            <CardHeader>
                <CardTitle>Setup my account</CardTitle>
                <CardDescription>Provide the following details to setup your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-2 flex-col gap-x-4 ">
                            <FormField
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                name='firstName'/>

                            <FormField
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                name='lastName'/>
                        </div>

                        <div className="grid grid-cols-2 flex-col gap-x-4">
                            <FormField
                                control={form.control}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                name='gender'/>
                        </div>

                        <FormField
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name='email'/>

                        <FormField
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Specialty</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name='specialty'/>
                        <AppButton state={buttonState} type="submit">Submit</AppButton>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default PhysicianOnboardingForm;
