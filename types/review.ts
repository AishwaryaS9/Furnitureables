export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
    id: string;
    rating: number;
    title?: string | null;
    comment?: string | null;
    status: ReviewStatus;
    createdAt: string;
    updatedAt: string;
    author: { id: string; name: string };
    product: { id: string; title: string; image?: string | null };
}

export interface ProductReviews {
    total: number;
    averageRating: number;
    canReview: boolean;
    currentUserReview: Review | null;
    reviews: Review[];
}

export type ReviewStatusFilter = "ALL" | ReviewStatus;

export interface ReviewCounts {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
}