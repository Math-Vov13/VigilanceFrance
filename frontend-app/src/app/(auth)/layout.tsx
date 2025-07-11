import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <main>
            { children }
            <ToastContainer/>
        </main>
    )
}

export default RootLayout;