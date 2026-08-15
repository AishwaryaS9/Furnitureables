import { OrderStatus, PaymentStatus } from "@/types/order";

export type CustomerSort = "newest" | "oldest" | "most-orders" | "highest-spend";

export interface AdminCustomer {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    totalOrders: number;
    totalSpent: number;
    currency: string;
    lastOrderAt?: string | null;
}

export interface AdminCustomerAddress {
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
}

export interface AdminCustomerOrder {
    id: string;
    orderNumber: string;
    itemsCount: number;
    total: number;
    currency: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
}

export interface AdminCustomerDetail extends AdminCustomer {
    addresses: AdminCustomerAddress[];
    orders: AdminCustomerOrder[];
}
