// Tipi condivisi per content (work, bulletin, services, team, careers, lab)
export interface ContentItem {
  path: string
  slug: string
  title?: string
  name?: string
  description?: string
  cover?: string
  ogImage?: string
  photo?: string
  date?: string
  updated?: string
  year?: number
  category?: string
  client?: string
  role?: string
  kind?: string
  status?: string
  employmentType?: string
  location?: string
  authors?: string[]
  author?: string
  deliverables?: string[]
  tags?: string[]
  body?: string
  bodyHtml?: string
  locale?: string
  type?: string
}

export interface WorkItem extends ContentItem {
  client: string
  year: number
  category?: string
  services?: string[]
  team?: string[]
  links?: { live?: string; bulletin?: string[] }
  gallery?: Array<{ src: string; caption?: string }>
  attachments?: Array<{ title?: string; url: string; kind?: string }>
  hero?: { type: string; src: string; poster?: string }
}

export interface BulletinItem extends ContentItem {
  authors?: string[]
  readingTime?: string
  relatedWork?: string[]
}

export interface ServiceItem extends ContentItem {
  icon?: string
  deliverables?: string[]
  pricing?: { label: string; cta: string }
  caseStudies?: string[]
  team?: string[]
}

export interface TeamItem extends ContentItem {
  name: string
  role: string
  since?: string
  employment?: string
  email?: string
  order?: number
}

export interface CareerItem extends ContentItem {
  employmentType?: string
  location?: string
  status?: string
  contact?: { email: string; subject?: string }
}

export interface LabItem extends ContentItem {
  kind?: string
  status?: string
  credits?: string[]
  links?: { live?: string; repo?: string; bulletin?: string[] }
}
