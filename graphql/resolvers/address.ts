import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AddressInput } from "@/types/address";

async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export const addressResolver = {
    Query: {
        // addresses: async () => {
        //     const user = await getCurrentUser();

        //     return prisma.address.findMany({
        //         where: {
        //             userId: user.id,
        //         },
        //         orderBy: [
        //             {
        //                 isDefault: "desc",
        //             },
        //             {
        //                 createdAt: "desc",
        //             },
        //         ],
        //     });
        // },
        addresses: async () => {
            const user = await getCurrentUser();

            const addresses = await prisma.address.findMany({
                where: {
                    userId: user.id,
                },
            });

            console.log(addresses);

            return addresses;
        },
    },

    Mutation: {
        createAddress: async (
            _: unknown,
            { input }: { input: AddressInput }
        ) => {
            const user = await getCurrentUser();

            return prisma.$transaction(async (tx) => {
                const addressCount = await tx.address.count({
                    where: {
                        userId: user.id,
                    },
                });

                const shouldBeDefault =
                    input.isDefault || addressCount === 0;

                if (shouldBeDefault) {
                    await tx.address.updateMany({
                        where: {
                            userId: user.id,
                        },
                        data: {
                            isDefault: false,
                        },
                    });
                }

                return tx.address.create({
                    data: {
                        ...input,
                        userId: user.id,
                        isDefault: shouldBeDefault,
                    },
                });
            });
        },

        updateAddress: async (
            _: unknown,
            {
                id,
                input,
            }: {
                id: string;
                input: AddressInput;
            }
        ) => {
            const user = await getCurrentUser();

            const existing = await prisma.address.findFirst({
                where: {
                    id,
                    userId: user.id,
                },
            });

            if (!existing) {
                throw new Error("Address not found");
            }

            return prisma.$transaction(async (tx) => {
                if (input.isDefault) {
                    await tx.address.updateMany({
                        where: {
                            userId: user.id,
                        },
                        data: {
                            isDefault: false,
                        },
                    });
                }

                return tx.address.update({
                    where: {
                        id,
                    },
                    data: input,
                });
            });
        },

        deleteAddress: async (
            _: unknown,
            { id }: { id: string }
        ) => {
            const user = await getCurrentUser();

            const existing = await prisma.address.findFirst({
                where: {
                    id,
                    userId: user.id,
                },
            });

            if (!existing) {
                throw new Error("Address not found");
            }

            await prisma.$transaction(async (tx) => {
                // Delete the requested address
                await tx.address.delete({
                    where: {
                        id,
                    },
                });

                // If the deleted address was the default,
                // promote another address (if any) to default.
                if (existing.isDefault) {
                    const anotherAddress = await tx.address.findFirst({
                        where: {
                            userId: user.id,
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    });

                    if (anotherAddress) {
                        await tx.address.update({
                            where: {
                                id: anotherAddress.id,
                            },
                            data: {
                                isDefault: true,
                            },
                        });
                    }
                }
            });

            return true;
        },

        setDefaultAddress: async (
            _: unknown,
            { id }: { id: string }
        ) => {
            const user = await getCurrentUser();

            const existing = await prisma.address.findFirst({
                where: {
                    id,
                    userId: user.id,
                },
            });

            if (!existing) {
                throw new Error("Address not found");
            }

            return prisma.$transaction(async (tx) => {
                await tx.address.updateMany({
                    where: {
                        userId: user.id,
                    },
                    data: {
                        isDefault: false,
                    },
                });

                return tx.address.update({
                    where: {
                        id,
                    },
                    data: {
                        isDefault: true,
                    },
                });
            });
        },
    },
};