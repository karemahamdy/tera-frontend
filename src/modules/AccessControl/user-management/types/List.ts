
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  userGroup: string;
  department: string;
  accessScope: string;
  status: string;
  lastLogin: string;
}

export interface FilterOption {
  label: string;
  value: string | null;
}

export interface FilterInputs<T = any> {
  placeholder: string;
  value: string | null;
  field: keyof T;
  options: FilterOption[];
}
