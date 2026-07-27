import type { Product, Repository } from '../types/command-center'

export const products: Product[] = [
  {
    name: 'Elev8 Command Center',
    organization: 'Bell Cap Group / Elev8 Technologies',
    description:
      'Institutional operating system and digital headquarters for the Elev8 ecosystem.',
    status: 'Foundation',
    phase: 'Phase 0',
  },
  {
    name: 'Elev8 AI Creator Studio',
    organization: 'Elev8 Technologies',
    description:
      'Local-first AI creative production platform for professional media workflows.',
    status: 'Active Development',
    phase: 'Release 0 Platform Stability',
  },
  {
    name: 'Elev8 OS',
    organization: 'Elev8 Technologies',
    description:
      'Enterprise operating platform for regulated industrial workflows.',
    status: 'Active Development',
    phase: 'Security Hardening',
  },
  {
    name: 'Elev8 Driving Academy',
    organization: 'Elev8 Technologies',
    description:
      'Driver education curriculum, academy operations, and launch infrastructure.',
    status: 'Planning',
    phase: 'Approval and Launch',
  },
  {
    name: 'SolaceSure',
    organization: 'Bell Cap Group',
    description:
      'Social enterprise focused on insurance access and financial education.',
    status: 'Strategic Design',
    phase: 'Legal Architecture',
  },
]

export const repositories: Repository[] = [
  {
    name: 'blackmaw-elev8-command-center',
    branch: 'phase/0-headquarters-foundation',
    status: 'In Progress',
    description: 'Headquarters application and institutional operating model.',
  },
  {
    name: 'Elev8 AI Creator Studio',
    branch: 'release/0-platform-stability',
    status: 'Healthy',
    description: 'AI creative production platform.',
  },
]
