"use client";

import { useTheme } from "next-themes";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider() {
    const { resolvedTheme } = useTheme();

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={resolvedTheme === "light" ? "light" : "dark"}
            transition={Bounce}
        />
    );
}
