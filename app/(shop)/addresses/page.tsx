import AddressList from "@/components/address/AddressList";

export default function AddressesPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD]">
            <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

                <div className="mb-10">

                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
                        Account
                    </p>

                    <h1 className="mt-3 text-4xl font-serif tracking-tight text-zinc-900">
                        My Addresses
                    </h1>

                    <p className="mt-3 max-w-2xl text-zinc-600 leading-7">
                        Save your delivery addresses for a faster
                        checkout experience. You can add multiple
                        addresses and choose a default one.
                    </p>

                </div>

                <AddressList />

            </section>
        </main>
    );
}