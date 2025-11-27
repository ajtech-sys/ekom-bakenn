export type RouteConfig = {
  label: string
  icon?: string
  path: string
  permissions?: string[]
}

export function defineRouteConfig(config: RouteConfig): RouteConfig {
  return config
}
