"use client";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface Props {
    value?: string;
    onChange: (value?: string) => void;
}

export default function PhoneNumberInput({
    value,
    onChange,
}: Props) {
    return (
        <PhoneInput
            international
            defaultCountry="IN"
            value={value}
            onChange={onChange}
            className="rounded-md border px-3 py-2"
        />
    );
}