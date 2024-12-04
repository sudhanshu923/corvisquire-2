"use client"

import React, { use, useEffect, useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"

import { GET } from "@/utils/requests/GET"
import { PUT } from "@/utils/requests/PUT"

import { Loader2 } from "lucide-react"

export default function Page({ params }: { params: Promise<{ _id: string }> }) {

    const [isVerified, setisVerified] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const { _id } = use(params)

    useEffect(() => {

        const fetchUser = async () => {

            try {

                setIsFetchingData(true)

                const response = await GET(`/api/user/${_id}`)
                setisVerified(response?.data?.user?.verified)

            } catch (error) {

                toast.error("Oops, something went wrong while fetching your account details. Please try again later.")

            } finally { setIsFetchingData(false) }

        }

        fetchUser()

    }, [_id])


    async function handleVerify() {

        try {

            setIsSubmitting(true)

            const response = await PUT("/api/auth/register/confirm", { _id })
            if (response?.status === 202) { setisVerified(true) } else { setisVerified(false) }

        } catch (error) {

            toast.error("Verification failed. Please check your network connection or try again later.")

        } finally { setIsSubmitting(false); router.refresh() }

    }

    if (isFetchingData === true) return <main className=' h-screen w-screen flex justify-center items-center bg-[#1A1A1A] text-white'>Loading...</main>;

    return (

        <>

            {isVerified ? (

                <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-b from-[#1a1a1a] via-[#333333] to-[#4e4e4e] p-6 md:p-12">
                    <div className="text-center text-white max-w-lg mx-auto">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight animate__animated animate__fadeIn animate__delay-1s">
                            🎉 Congratulations, you're <br />
                            <span className="text-green-500">Verified!</span>
                        </h1>

                        <h2 className="text-xl sm:text-2xl mb-8 text-gray-300 animate__animated animate__fadeIn animate__delay-1.5s">
                            Your account is now verified, and you’re all set to explore!
                        </h2>

                        <Link
                            className="p-4 px-8 bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transform transition-all duration-300 ease-in-out"
                            href="/"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </main>

            ) : (

                <main className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-[#111111] to-[#333333] p-8">
                    <div className="bg-[#222222] p-10 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-3xl text-white font-semibold text-center mb-8">Verify Your Identity</h2>
                        <p className="text-sm text-gray-300 text-center mb-6">
                            Click the button below to verify your identity and gain access.
                        </p>
                        {isSubmitting ? (
                            <Button disabled className=' flex justify-center items-center gap-2 w-full' >
                                <Loader2 className=' animate-spin' />
                                <span>Hold tight, we’re verifying you...</span>
                            </Button>
                        ) : (
                            <Button onClick={handleVerify} variant="destructive" className='w-full'>I Would Like to Verify Myself</Button>

                        )}
                    </div>
                </main>

            )}

        </>

    )

}
