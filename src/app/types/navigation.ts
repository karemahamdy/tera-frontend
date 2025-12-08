export interface NavItem {
  label: string
  icon?: string // prime/icon class or tailwind icon name
  route?: string
  children?: NavItem[]
  badge?: string | number
}
