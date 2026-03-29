import type { CaseStudy } from '../types'

export const caseStudies: CaseStudy[] = [
  {
    id: 'tidal',
    number: '01',
    title: 'Tidal — Designing for Stillness',
    meta: {
      role: 'Lead UX Designer',
      duration: '4 months',
      impact: '+142% daily active users',
    },
    description:
      'The challenge was creating stillness in a medium designed for engagement. Through research with meditation practitioners and anxiety therapists, we designed a breathing interface that mirrors real ocean wave patterns — 4-second inhale, 7-second hold, 8-second exhale — synced to generative audio that shifts with time of day.',
  },
  {
    id: 'drift',
    number: '02',
    title: 'Drift — The Flow State Engine',
    meta: {
      role: 'Product Designer',
      duration: '6 months',
      impact: '32% reduction in context switching',
    },
    description:
      'Remote work tools are noisy by nature. Drift was designed around the concept of "calm technology" — surfaces that recede when not needed and emerge with intent. We introduced ambient presence indicators, async-first communication patterns, and a spatial canvas that organizes work by energy level rather than priority.',
  },
  {
    id: 'pearl',
    number: '03',
    title: 'Pearl — Touch, Feel, Trust',
    meta: {
      role: 'UX & Brand Designer',
      duration: '3 months',
      impact: '2.8x conversion rate increase',
    },
    description:
      'Luxury skincare customers need to feel the product before they buy. We designed micro-interactions that simulate texture — subtle parallax on product images, haptic feedback on mobile, and a color-matching quiz that felt more like a conversation with a beauty advisor than a survey.',
  },
]
