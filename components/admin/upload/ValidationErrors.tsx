import { AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
    errors: string[];
}

export default function ValidationErrors({ errors }: Props) {
    if (!errors.length) return null;

    return (
        <Card
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            aria-labelledby="validation-errors-title"
            className="rounded-3xl border-destructive/30 backdrop-blur-xl shadow-xs overflow-hidden"
        >
            <CardHeader className="flex flex-row justify-between border-b">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/20 text-destructive shadow-2xs"
                        aria-hidden="true"
                    >
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle id="validation-errors-title" className="text-base font-bold text-destructive">
                            Validation Errors Detected
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-medium">
                            Please fix the following issues in your CSV file and re-upload.
                        </p>
                    </div>
                </div>

                <Badge
                    variant="destructive"
                    className="rounded-full font-semibold px-3 py-1"
                    aria-label={`${errors.length} validation issue${errors.length === 1 ? "" : "s"} detected`}
                >
                    {errors.length} Issue{errors.length === 1 ? "" : "s"}
                </Badge>
            </CardHeader>

            <CardContent className="p-6">
                <ul className="space-y-2.5" aria-label="List of CSV validation errors">
                    {errors.map((error, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-2xl bg-card/80 border border-destructive/20 text-xs sm:text-sm text-foreground shadow-2xs"
                        >
                            <XCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" aria-hidden="true" />
                            <span className="font-medium leading-relaxed">{error}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}