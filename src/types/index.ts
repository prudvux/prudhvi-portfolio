export interface Project {
  id: string
  emoji: string
  tag: string
  title: string
  description: string
  role: string
  delay: number
}

export interface CaseStudyMeta {
  role: string
  duration: string
  impact: string
}

export interface CaseStudy {
  id: string
  number: string
  title: string
  meta: CaseStudyMeta
  description: string
}

export interface Experience {
  id: string
  role: string
  company: string
}

export type ZoneTransitionVariant =
  | 'shore-to-shallow'
  | 'shallow-to-deep'
  | 'deep-to-cove'
  | 'cove-to-contact'
  | 'surface-to-light'

export type SectionId = 'hero' | 'featured-work' | 'what-i-do' | 'experience' | 'philosophy' | 'home-cta'
