import Link from 'next/link'

interface Props {
    value?: string;
}

export default function BreadcrumbNavigation({ value }: Props) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                <li>
                    <Link
                        href="/"
                        className="hover:text-foreground transition-colors focus-visible:outline-1 focus-visible:outline-ring rounded-sm"
                    >
                        Home
                    </Link>
                </li>
                <li aria-hidden="true" className="text-border">/</li>
                <li>
                    <span className="text-foreground font-semibold" aria-current="page">
                        {value}
                    </span>
                </li>
            </ol>
        </nav>

    )
}
