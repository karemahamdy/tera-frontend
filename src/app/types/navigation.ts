export interface NavItem {
  label: string
  icon?: string // prime/icon class or tailwind icon name
  route?: string
  children?: NavItem[]
  badge?: string | number
}

export interface QuickAccessItem {
  code: string;
  name: string;
  children: QuickAccessItem[];
}

export interface ModulesItem {
  code: string;
  name: string;
  screens?: ModulesItem[];
  sections?: ModulesItem[];
}

