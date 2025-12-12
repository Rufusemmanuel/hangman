import type { SVGProps } from 'react';

export const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.5 13.8 9.2 20.5 11 13.8 12.8 12 19.5 10.2 12.8 3.5 11 10.2 9.2 12 2.5Z" />
    <path d="M5.8 5.6 6.6 8.6 9.6 9.4 6.6 10.1 5.8 13.1 5 10.1 2 9.4 5 8.6 5.8 5.6Z" opacity="0.6" />
    <path d="M17.8 14.4 18.6 17.4 21.6 18.2 18.6 18.9 17.8 21.9 17 18.9 14 18.2 17 17.4 17.8 14.4Z" opacity="0.6" />
  </svg>
);

export const SoundOnIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15 9a3 3 0 0 1 0 6" />
    <path d="M17.5 5.5a6.5 6.5 0 0 1 0 13" />
  </svg>
);

export const SoundOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="m19 5-6 6m0 0 6 6m-6-6 6 6" />
  </svg>
);

export const SparkleDivider = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 120 8" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.6} {...props}>
    <path d="M4 4h32M60 2l3 2-3 2-3-2 3-2ZM84 4h32" />
  </svg>
);

export const LightningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M13.5 2 4 14h7l-1.5 8L20 10h-7l.5-8Z" />
  </svg>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);
