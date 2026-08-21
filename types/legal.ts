import { ReactNode } from "react";

export type CookieCategory = "functional" | "analytics" | "marketing";

export interface CookieCategoryMeta {
    id: CookieCategory;
    title: string;
    description: string;
}

export interface LegalSection {
    id: string;
    title: string;
    content: ReactNode;
}

export interface LegalPageLayoutProps {
    eyebrow: string;
    title: string;
    description: string;
    lastUpdated: string;
    sections: LegalSection[];
}
