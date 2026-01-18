export interface NavItem {
  label: string
  icon?: string // prime/icon class or tailwind icon name
  route?: string
  children?: NavItem[]
  badge?: string | number
}

export interface ModulesItem {
  code: string;
  name: string;
  screens: ModulesItem[];
  sections: ModulesItem[];
}
