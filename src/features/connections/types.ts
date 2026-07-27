export type ConnectionType =
  | 'website'
  | 'repository'
  | 'application'
  | 'api'
  | 'server'

export type ConnectionStatus =
  | 'healthy'
  | 'warning'
  | 'offline'
  | 'unknown'

export interface Connection {

  id: string

  name: string

  type: ConnectionType

  url: string

  environment:
    | 'development'
    | 'staging'
    | 'production'

  status: ConnectionStatus

  lastChecked: string

  responseTime: number

  description: string

}
