import Link from "next/link";
import Image from "next/image";
import designedForYou from "@/public/images/designed-for-you.png";
import { ArrowUpRight } from "lucide-react";

export default function DesignedForYou() {
    return (
        <section className="px-5 sm:px-6 lg:px-10 pb-14 md:pb-20">
            <div className="max-w-360 mx-auto sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[2.5rem] border border-border/50">
                    <div className="relative h-72 sm:h-96 md:h-auto">
                        <Image
                            src={designedForYou}
                            alt="A cozy lounge chair styled in a sunlit corner"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex items-center bg-secondary px-6 py-12 sm:px-10 sm:py-16 md:px-14 lg:px-16">
                        <div className="max-w-md space-y-6">
                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.1]">
                                Designed to Fit Your Life
                            </h2>

                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                From size to finish, every detail is shaped to match your
                                space and style. Work with our design team to create a piece
                                that perfectly fits your space, your style, and the way you
                                live. Discover the art of made-for-you design. Together,
                                we&apos;ll shape furniture that blends seamlessly with your
                                home while reflecting your personal taste.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-primary shadow-xs transition-all hover:scale-[1.03] hover:shadow-sm"
                            >
                                Learn More
                                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
