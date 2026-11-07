/**
 * Single source of truth for all portfolio content.
 * Used by the UI (app/) and by the AI assistant's system prompt (server/).
 * Edit this file to update the site — no component changes needed.
 */

export interface SocialLink {
  label: string
  href: string
  icon: 'linkedin' | 'github' | 'instagram' | 'tiktok' | 'mail'
}

export interface Project {
  id: string
  title: string
  summary: string
  category: 'Frontend' | 'Full-stack' | 'Design'
  year: string
  role: string
  stack: string[]
  demo?: string
  repo?: string
}

export interface Certificate {
  title: string
  issuer: string
  year: string
  skills: string[]
  url?: string
}

export interface Education {
  degree: string
  school: string
  period: string
  note?: string
}

export interface SkillGroup {
  name: string
  description: string
  items: string[]
}

export const profile = {
  name: 'Vichna Oudom',
  shortName: 'Vichna',
  initials: 'VO',
  role: 'Frontend Developer',
  roles: ['Frontend Developer', 'Vue & Nuxt Specialist', 'UI Engineer'],
  headline: 'I build fast, accessible and well-crafted web interfaces.',
  summary:
    'Frontend developer with 3+ years of experience turning product ideas into reliable, ' +
    'responsive applications with Vue, Nuxt and React. I care about clean architecture, ' +
    'thoughtful UI details and shipping work that holds up in production.',
  location: 'Phnom Penh, Cambodia',
  timezone: 'GMT+7',
  email: 'hello@vichna.dev',
  available: true,
  availability: 'Available for freelance & full-time roles',
  /** Path to a professional headshot in /public (e.g. '/profile.jpg'). Leave empty to show initials. */
  photo: '/profile.webp',
  /** Path to your CV in /public. Leave empty to hide the download button. */
  cv: '',
  siteUrl: 'https://vichna.dev',
}

export const socials: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/vichna', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/vichna', icon: 'github' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
]

export const stats = [
  { value: '3+', label: 'Years of experience' },
  { value: '50+', label: 'Projects delivered' },
  { value: '20+', label: 'Clients worldwide' },
]

export const principles = [
  {
    title: 'Craft',
    text: 'Pixel-accurate, responsive interfaces with considered motion and typography.',
  },
  {
    title: 'Performance',
    text: 'Lean bundles, fast first paint and Core Web Vitals treated as a feature.',
  },
  {
    title: 'Accessibility',
    text: 'Semantic markup, keyboard support and contrast that works for everyone.',
  },
]

export const coreStack = ['Vue', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js']

export const skillGroups: SkillGroup[] = [
  {
    name: 'Frontend',
    description: 'Production interfaces and component systems.',
    items: ['Vue 3', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Pinia', 'HTML & CSS'],
  },
  {
    name: 'Backend',
    description: 'APIs and data layers that support the product.',
    items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Python'],
  },
  {
    name: 'Design & Workflow',
    description: 'From wireframe to deployment.',
    items: ['Figma', 'UI/UX Design', 'Prototyping', 'Git & GitHub', 'Docker', 'CI/CD'],
  },
]

export const projects: Project[] = [
  {
    id: 'commerce',
    title: 'Sakura Commerce',
    summary: 'E-commerce platform with real-time cart, product search and a streamlined three-step checkout.',
    category: 'Full-stack',
    year: '2024',
    role: 'Lead frontend',
    stack: ['Nuxt', 'Vue 3', 'Node.js'],
    demo: '#',
    repo: '#',
  },
  {
    id: 'builder',
    title: 'Portfolio Builder',
    summary: 'Drag-and-drop website builder with live preview, theming and one-click static export.',
    category: 'Frontend',
    year: '2024',
    role: 'Frontend developer',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    demo: '#',
    repo: '#',
  },
  {
    id: 'analytics',
    title: 'Insights Dashboard',
    summary: 'Analytics dashboard with AI-assisted summaries and interactive, filterable charts.',
    category: 'Full-stack',
    year: '2023',
    role: 'Full-stack developer',
    stack: ['Vue 3', 'Python', 'MongoDB'],
    demo: '#',
    repo: '#',
  },
  {
    id: 'design-system',
    title: 'Brand Design System',
    summary: 'Token-based design system and documented component library used across four products.',
    category: 'Design',
    year: '2023',
    role: 'Design engineer',
    stack: ['Figma', 'Vue 3', 'Storybook'],
    demo: '#',
    repo: '#',
  },
  {
    id: 'chat',
    title: 'Realtime Messenger',
    summary: 'Messaging app with end-to-end encryption, file sharing and voice notes.',
    category: 'Full-stack',
    year: '2023',
    role: 'Full-stack developer',
    stack: ['Next.js', 'Socket.io', 'PostgreSQL'],
    demo: '#',
    repo: '#',
  },
  {
    id: 'motion',
    title: 'Motion UI Kit',
    summary: 'Vue component library focused on accessible micro-interactions and reduced-motion support.',
    category: 'Frontend',
    year: '2022',
    role: 'Author & maintainer',
    stack: ['Vue 3', 'GSAP', 'TypeScript'],
    demo: '#',
    repo: '#',
  },
]

export const certificates: Certificate[] = [
  { title: 'Advanced React', issuer: 'Meta', year: '2024', skills: ['React', 'Hooks', 'Context API'], url: '#' },
  { title: 'Vue.js & Nuxt Mastery', issuer: 'Vue School', year: '2024', skills: ['Vue 3', 'Nuxt', 'Pinia'], url: '#' },
  { title: 'UI/UX Design', issuer: 'Google', year: '2024', skills: ['Figma', 'User Research', 'Prototyping'], url: '#' },
  { title: 'Full-Stack JavaScript', issuer: 'IBM', year: '2023', skills: ['Node.js', 'Express', 'MongoDB'], url: '#' },
  { title: 'TypeScript Expert', issuer: 'Microsoft', year: '2023', skills: ['TypeScript', 'Generics', 'Patterns'], url: '#' },
  { title: 'Tailwind CSS', issuer: 'Frontend Masters', year: '2023', skills: ['Tailwind', 'Responsive', 'Animation'], url: '#' },
]

export const education: Education[] = [
  { degree: "Master's in Computer Science", school: 'University of Technology', period: '2021 – 2023', note: 'GPA 4.0' },
  { degree: "Bachelor's in Software Engineering", school: 'Institute of Technology', period: '2017 – 2021', note: 'GPA 3.8' },
  { degree: 'Web Development Bootcamp', school: 'Coding Academy', period: '2016', note: 'Graduated with distinction' },
]

export const services = ['Frontend development', 'Full-stack applications', 'UI/UX design', 'API integration', 'Technical consulting']

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

/** Builds the AI assistant's knowledge from the same data the site renders. */
export function buildAssistantContext(): string {
  return [
    `Name: ${profile.name}. Role: ${profile.role}. Location: ${profile.location}.`,
    `Summary: ${profile.summary}`,
    `Availability: ${profile.availability}. Contact email: ${profile.email}.`,
    `Highlights: ${stats.map(s => `${s.value} ${s.label.toLowerCase()}`).join(', ')}.`,
    `Skills: ${skillGroups.map(g => `${g.name}: ${g.items.join(', ')}`).join('. ')}.`,
    `Projects: ${projects.map(p => `${p.title} (${p.category}, ${p.year}, ${p.stack.join('/')}) – ${p.summary}`).join(' | ')}`,
    `Certificates: ${certificates.map(c => `${c.title} – ${c.issuer} (${c.year})`).join('; ')}.`,
    `Education: ${education.map(e => `${e.degree}, ${e.school}, ${e.period}`).join('; ')}.`,
    `Services: ${services.join(', ')}.`,
  ].join('\n')
}
