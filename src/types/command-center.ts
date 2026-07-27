export type ProductStatus =
  | 'Operational'
  | 'Active Development'
  | 'Foundation'
  | 'Planning'
  | 'Strategic Design'

export interface Product {
  name: string
  organization: string
  description: string
  status: ProductStatus
  phase: string
}

export interface Repository {
  name: string
  branch: string
  status: 'Healthy' | 'In Progress' | 'Planning'
  description: string
}
