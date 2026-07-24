"use client";

import { useEffect } from "react";

export default function RazorpayProvider() {
    useEffect(() => {
        if (document.getElementById("razorpay-sdk")) return;

        const script = document.createElement("script");

        script.id = "razorpay-sdk";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        document.body.appendChild(script);
    }, []);

    return null;
}