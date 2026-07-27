import { createMockWebsiteAdapter } from './adapters/mockWebsiteAdapter'
import type { Integration } from './types'

export const integrationRegistry: Integration[] = [
  createMockWebsiteAdapter({
    id: 'command-center-web',
    name: 'Elev8 Command Center',
    description: 'Institutional headquarters frontend',
    environment: 'development',
    url: 'http://localhost:5173',
  }),

  createMockWebsiteAdapter({
    id: 'creator-studio-web',
    name: 'Elev8 AI Creator Studio',
    description: 'AI creative production platform',
    environment: 'development',
    url: 'http://localhost',
  }),
]
