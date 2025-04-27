import type { FeatureItem, TestimonialItem, PricingPlan, FAQItem } from '../types';

export const APP_NAME = "RequirementAI";

export const FEATURES: FeatureItem[] = [
  {
    title: "Multi-format Input Analysis",
    description: "Upload and analyze various document types including meetings minutes, emails, Word, Excel, PDFs, and web pages.",
    icon: "FileUp"
  },
  {
    title: "AI-powered Extraction",
    description: "Automatically extract functional and non-functional requirements from your documents using advanced AI algorithms.",
    icon: "Brain"
  },
  {
    title: "Real-time Questioning",
    description: "System poses smart questions based on previous responses to fill requirements gaps and clarify ambiguities.",
    icon: "MessagesSquare"
  },
  {
    title: "Standardized Outputs",
    description: "Generate requirement documents in standardized formats and extract user stories into Excel sheets for Jira integration.",
    icon: "FileOutput"
  },
  {
    title: "Requirement Prioritization",
    description: "Automatically prioritize requirements numerically and using MoSCoW methodology based on context and importance.",
    icon: "ListFilter"
  },
  {
    title: "Gap Analysis",
    description: "Highlights potentially inadequate requirements that may need manual intervention or further clarification.",
    icon: "AlertTriangle"
  },
  {
    title: "Version Control",
    description: "Maintain an inventory of requirement documents with comprehensive version control mechanisms.",
    icon: "History"
  },
  {
    title: "Multi-user Support",
    description: "Accommodate multiple concurrent users handling different types of requirements simultaneously.",
    icon: "Users"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "RequirementAI has cut our requirements gathering process time by 65% while improving quality and consistency.",
    author: "Sarah Johnson",
    role: "Product Manager",
    company: "TechNova Systems"
  },
  {
    quote: "The automated prioritization and gap analysis features have been game-changers for our development planning.",
    author: "Michael Chen",
    role: "Engineering Director",
    company: "Quantum Solutions"
  },
  {
    quote: "Integration with our existing tools was seamless, and the standardized outputs have greatly improved our documentation.",
    author: "Priya Sharma",
    role: "Scrum Master",
    company: "AgileWorks"
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for small teams and projects",
    features: [
      "Up to 5 users",
      "10 projects",
      "Basic requirement extraction",
      "Standard document templates",
      "Email support"
    ],
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "$249",
    description: "Ideal for growing teams with multiple projects",
    features: [
      "Up to 20 users",
      "Unlimited projects",
      "Advanced requirement analysis",
      "Custom document templates",
      "Jira & Confluence integration",
      "Priority support"
    ],
    cta: "Start Free Trial",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with complex requirements",
    features: [
      "Unlimited users",
      "Advanced security features",
      "Custom AI model training",
      "API access",
      "Dedicated account manager",
      "SLA guarantees"
    ],
    cta: "Contact Sales"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How accurate is the AI in extracting requirements?",
    answer: "Our AI has been trained on thousands of requirement documents across various industries and achieves an average accuracy rate of 92%. The system also highlights areas where it has lower confidence, allowing for human review of potentially ambiguous requirements."
  },
  {
    question: "Can the system integrate with our existing tools?",
    answer: "Yes, RequirementAI integrates with popular project management tools like Jira and Confluence. We also offer API access for custom integrations with your existing workflows and systems."
  },
  {
    question: "How does the system handle sensitive or confidential information?",
    answer: "We take data security seriously. All uploaded documents and generated requirements are encrypted both in transit and at rest. Enterprise customers can also opt for private cloud deployments for additional security measures."
  },
  {
    question: "What file formats are supported for upload?",
    answer: "RequirementAI supports a wide range of formats including PDF, Word (.docx, .doc), Excel (.xlsx, .xls), plain text (.txt), Markdown (.md), HTML, and common image formats (.png, .jpg) containing text."
  },
  {
    question: "How long does it take to implement RequirementAI?",
    answer: "Most teams are up and running within a day. Our guided setup process helps you configure the system to your needs, and our support team is available to assist with any questions during implementation."
  }
];