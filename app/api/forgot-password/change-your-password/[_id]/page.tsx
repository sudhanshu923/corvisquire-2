"use client"

import React, { use, useEffect, useState } from "react"

import Link from "next/link"

import { useFormik } from "formik"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { GET } from "@/utils/requests/GET"
import { PUT } from "@/utils/requests/PUT"

import { Loader2 } from "lucide-react"

export default function Page({ params }: { params: Promise<{ _id: string }> }) {

    const [isPasswordChanged, setIsPasswordChanged] = useState<Date | null>(null)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { _id } = use(params)

    useEffect(() => {

        const fetchUser = async () => {

            try {

                setIsFetchingData(true)

                const response = await GET(`/api/user/${_id}`)
                setIsPasswordChanged(response?.data?.user?.resettingExpiresIn)

            } catch (error) {

                toast.error("Failed to fetch your account details. Please try again later.")

            } finally { setIsFetchingData(false) }

        }

        fetchUser()

    }, [_id])

    const formik = useFormik({

        initialValues: {
            Set_Password: '',
            Confirm_Password: ''
        },

        // validate:Validate,
        validateOnBlur: false,
        validateOnChange: false,

        onSubmit: async (values: { Set_Password: string; Confirm_Password: string }) => {

            setIsSubmitting(true)
            await formik.validateForm();

            if (!formik.isValid) {
                toast.error("try entering some real values")
                setIsSubmitting(false)
                return
            }

            if (values.Set_Password !== values.Confirm_Password) {
                toast.error("passwords should be same")
                setIsSubmitting(false)
                return
            }

            try {

                const data = {
                    password: values.Confirm_Password,
                    _id,
                }

                await PUT("/api/forgot-password/change-your-password", data)

            } catch (error) {

                toast.error("An error occurred while resetting your password. Please try again later.")

            } finally { setIsSubmitting(false) }

        }

    })

    if (isFetchingData === true) return <main className=' h-screen w-screen flex justify-center items-center bg-[#1A1A1A] text-white'>Loading...</main>;

    return (
        <>
            {isPasswordChanged === null || isPasswordChanged === undefined ? (
                <main className="h-screen w-screen flex flex-col justify-center items-center bg-[#111111] px-6 sm:px-12 md:px-24">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl text-slate-300 text-center font-semibold leading-tight mb-8">
                        The Time for <span className="text-red-500">Password</span> Reset <span className="text-red-500">Has</span> Ran Out
                    </h1>

                    <Link href="/" className="p-4 bg-white rounded-full text-black font-semibold text-lg sm:text-xl md:text-2xl flex justify-center items-center shadow-lg hover:bg-red-500 hover:text-white transition duration-300 transform hover:scale-105 absolute bottom-8 right-8">
                        Try Again
                    </Link>
                </main>

            ) : (
                <main className="h-screen w-screen flex justify-center items-center bg-[#111111] px-6 sm:px-12 md:px-24">
                    <form onSubmit={formik.handleSubmit} className="bg-[#1f1f1f] p-8 rounded-lg shadow-lg w-full sm:w-96 md:w-1/2 lg:w-1/3">

                        <h2 className="text-3xl font-semibold text-slate-300 text-center mb-6">
                            Reset Your Password
                        </h2>

                        <section className="flex flex-col gap-6">

                            <div>
                                <Label htmlFor="Set_Password" className="block text-slate-300 text-lg font-medium mb-2">
                                    Set Password
                                </Label>
                                <Input
                                    type="password"
                                    name="Set_Password"
                                    id="Set_Password"
                                    value={formik.values.Set_Password}
                                    onChange={formik.handleChange}
                                    placeholder="Set a new password"
                                    className="w-full p-3 rounded-md bg-[#2a2a2a] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <Label htmlFor="Confirm_Password" className="block text-slate-300 text-lg font-medium mb-2">
                                    Confirm Password
                                </Label>
                                <Input
                                    type="password"
                                    name="Confirm_Password"
                                    id="Confirm_Password"
                                    value={formik.values.Confirm_Password}
                                    onChange={formik.handleChange}
                                    placeholder="Confirm your password"
                                    className="w-full p-3 rounded-md bg-[#2a2a2a] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                        </section>

                        {isSubmitting ? (
                            <Button disabled className="w-full p-3 mt-6 bg-gray-500 text-white rounded-md flex justify-center items-center cursor-not-allowed">
                                <Loader2 className="h-5 mr-2 w-5 animate-spin" />
                                Finalizing Reset...
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full p-3 mt-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                            >
                                Reset Password
                            </Button>
                        )}

                    </form>
                </main>

            )}

        </>
    )
}
