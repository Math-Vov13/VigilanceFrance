"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();
    useEffect(() => {
        console.log("Loading:", loading);
        console.log("Authenticated:", isAuthenticated);
        if (!loading && !isAuthenticated) {
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
    }, [router, loading, isAuthenticated]);

    return (
        loading ? (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        ) : (

            isAuthenticated ? (
                children
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <p>Vous devez être connecté pour voir cette page.</p>
                    <p><i>Vous allez être redirigé...</i></p>
                </div>
            )
        )
    )
}

export default RootLayout;