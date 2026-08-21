import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-background text-foreground antialiased py-10 sm:py-16 lg:py-20"
    >
      <span className="sr-only">Loading About Us page...</span>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-12 sm:h-14 w-full max-w-2xl rounded-xl" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-md" />
        </div>

        {/* Hero Image Banner */}
        <Skeleton className="h-64 sm:h-80 lg:h-96 w-full rounded-3xl" />

        {/* Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-border/60 bg-card shadow-2xs h-full">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-5/6 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Narrative Section */}
        <div className="rounded-3xl border border-border/60 bg-secondary/20 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <Skeleton className="h-9 w-3/4 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
            <Skeleton className="h-4 w-36 rounded-md pt-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-2 flex flex-col items-center justify-center">
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="space-y-8">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 flex flex-col items-center lg:items-start">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-8">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border-border/60 bg-card shadow-2xs h-full">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3.5 w-2/3 rounded-md" />
                  </div>
                  <div className="pt-2 border-t border-border/40 space-y-1">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}