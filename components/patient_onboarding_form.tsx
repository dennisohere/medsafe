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
import { Calendar } from "@/components/ui/calendar"
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
import {cn, PatientFormSchema} from "@/lib/utils";
import {PopoverContent, PopoverTrigger, Popover} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {useAppSelector} from "@/store/store";
import {useRouter} from "next/navigation";



const PatientOnboardingForm = () => {
    const {ready} = usePrivy();
    const {blockchain, user} = useAppSelector(state => state.app);
    const router = useRouter();

    const form = useForm<z.infer<typeof PatientFormSchema>>({
        resolver: zodResolver(PatientFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: '',
            contactAddress: '',
            contactPhoneNumber: '',
            emergencyContactName: '',
            emergencyContactAddress: '',
            emergencyContactPhone: '',
            dateOfBirth: new Date()
        },
    })


    const onSubmit = async (formData: z.infer<typeof PatientFormSchema>) => {
        console.log(formData);

        await blockchain!.addPatient(user!.id,
            formData.firstName,
            formData.lastName,
            formData.gender,
            formData.dateOfBirth.toLocaleDateString(),
            formData.contactAddress,
            formData.contactPhoneNumber,
            formData.emergencyContactName,
            formData.emergencyContactAddress,
            formData.emergencyContactPhone,);

        form.reset();
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name='firstName'/>

                            <FormField
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name='lastName'/>
                        </div>

                        <div className="grid grid-cols-2 flex-col gap-x-4">
                            <FormField
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue  />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name='gender'/>

                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Date of birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={field.onChange}
                                                    selected={field.value}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name='contactAddress'/>

                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name='contactPhoneNumber'/>

                        <div className="grid grid-cols-2 gap-x-4">
                            <FormField
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emergency contact name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name='emergencyContactName'/>

                            <FormField
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emergency contact phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name='emergencyContactPhone'/>
                        </div>

                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency contact address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name='emergencyContactAddress'/>

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}

export default PatientOnboardingForm;
