export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}