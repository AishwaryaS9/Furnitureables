interface Props {
    errors: string[];
}

export default function ValidationErrors({ errors }: Props) {
    return (
        <div className="rounded-lg border bg-red-50 p-5">

            <h2 className="font-semibold mb-3 text-red-700">
                Validation Errors
            </h2>

            <ul className="list-disc space-y-2 pl-5">

                {errors.map((error, index) => (
                    <li key={index}>
                        {error}
                    </li>
                ))}

            </ul>

        </div>
    );
}