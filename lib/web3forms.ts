const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

interface Web3FormsPayload {
    subject: string;
    from_name?: string;
    [key: string]: unknown;
}

interface Web3FormsResult {
    success: boolean;
    message: string;
}

export async function submitToWeb3Forms(
    payload: Web3FormsPayload
): Promise<Web3FormsResult> {
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
        console.error(
            "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set. Add it to your .env file — get a free key at https://web3forms.com"
        );
        return {
            success: false,
            message: "This form isn't configured yet. Please try again later.",
        };
    }

    try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: accessKey,
                from_name: "Furnitureables Website",
                ...payload,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error("Web3Forms submission failed:", data);
            return {
                success: false,
                message:
                    data?.message ||
                    "We couldn't submit this right now. Please try again shortly.",
            };
        }

        return { success: true, message: data.message || "Submitted." };
    } catch (error) {
        console.error("Web3Forms request error:", error);
        return {
            success: false,
            message: "Something went wrong. Please check your connection and try again.",
        };
    }
}
