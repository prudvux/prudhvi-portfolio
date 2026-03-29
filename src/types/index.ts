export interface Project {
  id: string
  emoji: string
  tag: string
  title: string
  description: string
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

export type ZoneTransitionVariant =
  | 'shore-to-shallow'
  | 'shallow-to-deep'
  | 'deep-to-cove'
  | 'cove-to-contact'

export type SectionId = 'hero' | 'projects' | 'case-studies' | 'about' | 'contact'
