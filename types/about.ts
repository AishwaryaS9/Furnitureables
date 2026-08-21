import { LucideIcon } from "lucide-react";

export interface AboutValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface AboutProcessStep {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
  ariaLabel: string;
}

export interface AboutTestimonial {
  quote: string;
  name: string;
  role: string;
}