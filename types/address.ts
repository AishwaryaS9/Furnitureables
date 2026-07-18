export interface Address {
    id: string;

    fullName: string;
    phoneCode: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    landmark?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;

    isDefault: boolean;

    createdAt: string;
    updatedAt: string;
}


export interface AddressInput {
    fullName: string;
    phoneCode: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export interface UpdateAddressInput
    extends Partial<AddressInput> { }

export interface CreateAddressArgs {
    input: AddressInput;
}

export interface UpdateAddressArgs {
    id: string;
    input: UpdateAddressInput;
}

export interface DeleteAddressArgs {
    id: string;
}

export interface SetDefaultAddressArgs {
    id: string;
}

export interface AddressesQueryResponse {
    addresses: Address[];
}

export interface AddressMutationResponse {
    createAddress: Address;
}

export interface UpdateAddressResponse {
    updateAddress: Address;
}

export interface DeleteAddressResponse {
    deleteAddress: boolean;
}

export interface SetDefaultAddressResponse {
    setDefaultAddress: Address;
}