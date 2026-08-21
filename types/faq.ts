export interface FaqItem {
    question: string;
    answer: string;
}

export interface FaqCategory {
    id: string;
    title: string;
    items: FaqItem[];
}

export interface FaqContentProps {
    categories: FaqCategory[];
}
