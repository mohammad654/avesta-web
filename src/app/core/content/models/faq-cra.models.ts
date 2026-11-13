import { Cta } from './seo.models';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  footnote?: string;
}

export interface CraOption {
  label: string;
  points: number;
  exit?: boolean;
}

export interface CraQuestion {
  id: number;
  text: string;
  hint: string;
  hintFootnote?: string;
  options: CraOption[];
  action: string;
}

export interface CraBandCopy {
  headline: string;
  body: string;
}

export interface CraCheckerContent {
  heading: string;
  sub: string;
  start: string;
  micro: string;
  progress: string;
  back: string;
  next: string;
  seeResult: string;
  hintLabel: string;
  questions: CraQuestion[];
  bands: { strong: CraBandCopy; progress: CraBandCopy; early: CraBandCopy };
  critical: string;
  actionsHeading: string;
  scoreLabel: string;
  exit: { body: string; cta: Cta };
  ctas: { book: Cta; email: string; restart: string };
  disclaimer: string;
  email: {
    legend: string;
    emailLabel: string;
    consent: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    emailError: string;
    consentError: string;
  };
}
